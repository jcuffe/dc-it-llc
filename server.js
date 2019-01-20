const soap = require("soap");
const crypto = require("crypto");
const url = "https://sandbox.usaepay.com/soap/gate/E101690F/usaepay.wsdl";
const sourceKey = "_4Wo96cs0Xkqpx8ciH28kI6384WaNt28";
const pin = "90807"

soap.createClientAsync(url)
  .then(client => {
    DCITReport(client);
    runTransaction(client);
  })

const runTransaction = (client) => {
  console.log("\n=== Running Transaction ===\n")
  const cardNumber = "4000100011112224"
  const cardExp = "0919"
  const cardCvv = "222"
  const address = "123 Anyplace, CA 95321"
  const args = {
    Token: generateToken(),
    Parameters: {
      Command: "sale",
      AccountHolder: "Daniel Chamorro",
      Details : {
        OrderID: Date.now(),
        Description: "a test",
        Amount: 1,
        Currency: "USD",
      },
      CreditCardData: {
        CardNumber: cardNumber,
        CardCode: cardCvv,
        CardExpiration: cardExp
      },
      BillingAddress: address, 
      // ShippingAddress: 
    }
  }
  client.runTransaction(args, (err, result, soapRes) => {
    if (err) {
      console.log(err);
    } else {
      console.log("\nResult: \n")
      console.log(result.runTransactionReturn);
    }
  })
}

const DCITReport = (client) => {
  console.log("\n=== Fetching Report ===\n")
  const args = {
    Token: generateToken(),
    Options: {
      StartDate: "05/15/2018",
      EndDate: "01/19/2019"
    },
    Format: "csv",
    Report: "Custom:DCIT Custom Test Report"
  };
  client.usaepayService.ueSoapServerPort.getCustomerReport(args, (err, result, soapRes) => {
    if (err) {
      console.log("ERROR\n\n");
    } else {
      const decoded = decodeResult(result.getCustomerReportReturn.$value);
      console.log("\nRequest: \n")
      console.log(client.lastRequest)
      console.log("\nResponse: \n")
      console.log(soapRes)
      console.log("\nDecoded value: \n")
      console.log(decoded);
    } 
  });
}

const decodeResult = (result) => {
  return Buffer.from(result, 'base64').toString('ascii');
}

const generateToken = () => {
  const hasher = crypto.createHash("sha1");
  const seed = Date.now();
  const combined = [sourceKey, seed, pin].join("");
  const hash = hasher.update(combined).digest("hex")

  return {
    SourceKey: sourceKey,
    PinHash: {
      Type: "sha1",
      Seed: seed,
      HashValue: hash
    }
  }
}