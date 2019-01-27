const soap = require("soap");
const crypto = require("crypto");

const wsdl = "https://sandbox.usaepay.com/soap/gate/E101690F/usaepay.wsdl";

const getSoapClient = async () => soap.createClientAsync(wsdl);

const runTransaction = (client, body) => {
  const cardExp = body["Expiration Month"] + body["Expiration Year"].slice(2);
  const args = {
    Token: generateToken(),
    Parameters: {
      Command: "sale",
      AccountHolder: body["Debtor Name"],
      Details: {
        OrderID: Date.now(),
        Description: "a test",
        Amount: 1,
        Currency: "USD"
      },
      CreditCardData: {
        CardNumber: body["Card Number"],
        CardExpiration: cardExp
      },
      BillingAddress: {
        Street: body["Address"],
        Zip: body["Zip Code"]
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

module.exports = { getSoapClient, runTransaction, DCITReport };
