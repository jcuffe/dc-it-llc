const soap = require("soap");
const crypto = require("crypto");
const Processed = require("../models/payments/processed");

const wsdl = "https://sandbox.usaepay.com/soap/gate/E101690F/usaepay.wsdl";

const getClient = async () => soap.createClientAsync(wsdl);

const validateTransactions = async client => {
  // load all transactions from processed table with missing refnum
  // query billingtree api to determine transaction status
  // TODO ^ find the api endpoint that allows a tx to be queried
  // update refnum for successful transactions
  // delete rows of unsuccessful transactions
};

const batchTransactions = async (client, transactions) => {
  console.log(`Batching ${transactions.length} transactions`);
  const responses = await Promise.all(
    transactions.map(async (tx, i) => {
      let result;
      let refnum = null;
      // Don't run transaction if one already exists with this id
      const duplicate = await validateTransaction(client, tx);
      if (duplicate) {
        result = "Duplicate Transaction";
      } else {
        await Processed.insertTransaction(tx);
        const response = await runTransaction(client, tx);
        result = response.Result.$value;
        refnum = response.RefNum.$value;
        if (result === "Approved") {
          // Transaction successful, finalize in DB
          await Processed.finalizeTransaction(tx.id, refnum);
        } else {
          // Transaction failed, remove from DB
          result = response.Error.$value;
          await Processed.removeTransaction(tx.id);
        }
      }
      return {
        id: tx.id,
        "Debtor Name": tx["Debtor Name"],
        Result: result,
        ReferenceNo: refnum
      };
    })
  );
  return responses;
};

const validateTransaction = (client, tx) => {
  const args = {
    Token: generateToken(),
    Search: [
      {
        Field: "OrderID",
        Type: "eq",
        Value: tx.id
      }
    ],
    Limit: 1000
  };

  return new Promise((resolve, reject) => {
    client.searchTransactions(args, (err, result) => {
      if (err) {
        reject(err);
      } else {
        try {
          const response = result.searchTransactionsReturn.Transactions.item;
          if (response) {
            const txs = response.map(tx => tx.Response.Result.$value);
            if (txs.includes("Approved")) {
              // TODO resolve with the refnum
              resolve(true);
            } else {
              resolve(null);
            }
          }
        } catch (err) {
          console.log(err);
          resolve(false);
        }
      }
    });
  });
};

const runTransaction = (client, tx) => {
  const cardExp = tx["Expiration Month"] + tx["Expiration Year"].slice(2);
  const args = {
    Token: generateToken(),
    Parameters: {
      Command: "sale",
      AccountHolder: tx["Debtor Name"],
      Details: {
        // TODO maybe: come up with a more unique order id and store it with transaction
        OrderID: tx["id"],
        Description: "Collected payment",
        Amount: tx["Amount"],
        Currency: "USD"
      },
      CreditCardData: {
        CardNumber: tx["Card Number"],
        CardExpiration: cardExp,
        CardCode: tx["CVV"]
      },
      BillingAddress: {
        Street: tx["Address"],
        Zip: tx["Zip Code"]
      }
    }
  };

  return new Promise((resolve, reject) => {
    client.runTransaction(args, (err, result, soapRes) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.runTransactionReturn);
      }
    });
  });
};

const DCITReport = client => {
  const report = client.usaepayService.ueSoapServerPort.getCustomerReport;
  const args = {
    Token: generateToken(),
    Options: [
      {
        Field: "StartDate",
        Value: "05/15/2018"
      },
      {
        Field: "EndDate",
        Value: "01/19/2019"
      }
    ],
    Format: "csv",
    Report: "Custom:DCIT Custom Test Report"
  };
  return new Promise((resolve, reject) => {
    report(args, (err, result, soapRes) => {
      if (err) {
        reject(err);
      } else {
        const decoded = decodeResult(result.getCustomerReportReturn.$value);
        resolve(decoded);
      }
    });
  });
};

const decodeResult = result => {
  return Buffer.from(result, "base64").toString("ascii");
};

const generateToken = () => {
  const sourceKey = process.env.USAEPAY_SOURCE_KEY;
  const pin = process.env.USAEPAY_PIN;
  const hasher = crypto.createHash("sha1");
  const seed = Date.now();
  const combined = [sourceKey, seed, pin].join("");
  const hash = hasher.update(combined).digest("hex");

  return {
    SourceKey: sourceKey,
    PinHash: {
      Type: "sha1",
      Seed: seed,
      HashValue: hash
    }
  };
};

module.exports = {
  getClient,
  DCITReport,
  batchTransactions,
  validateTransaction
};
