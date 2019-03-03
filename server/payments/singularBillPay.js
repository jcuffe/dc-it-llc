const Swagger = require("swagger-client");
const Processed = require("../models/payments/processed");
const Pending = require("../models/payments/pending");

const getClient = async () => {
  const specUrl = 'http://files1.restunited.com/libraries/singular_api_20170302224424/prod/1/0/0/sw/swagger2/swagger.json'
  const client = await Swagger(specUrl);
  return client.apis;
};

const batchTransactions = async (client, ids) => {
  const transactions = await Pending.withIds(ids);
  const responses = await Promise.all(
    transactions.map(async (tx, i) => {
      let result;
      let refnum = null;
      const validated = await validateTransaction(client, tx.id);
      if (validated.length) {
        result = "Duplicate Transaction."
      } else {
        await Processed.insertTransaction(tx);
        const response = await runTransaction(client, tx);
        if (response.responsemessage === "success") {
          result = "Approved";
          refnum = response.transactionreference;
          await Processed.finalizeTransaction(tx.id, refnum);
        } else {
          result = response.responsemessage;
          await Processed.removeTransaction(tx.id);
        }
      }
      return {
        id: tx.id,
        "Debtor Name": tx["Debtor Name"],
        Result: result,
        ReferenceNo: refnum
      }
    })
  );
  return responses;
}

const runTransaction = async (client, tx) => {
  const [firstName, lastName] = tx["Debtor Name"].split(" ");
  const cardExp = tx["Expiration Month"] + tx["Expiration Year"].slice(2);
  const args = {
    payeefirstname: firstName,
    payeelastname: lastName,
    address: tx["Address"],
    zip: tx["Zip"],
    orderid: tx["id"],
    paymentmode: "card",
    partnerkey: "21A47A5F-9992-46E5-A198-58756A38DDAF",
    partnerid: "pyds",
    country: "us",
    currency: "usd",
    cvv: tx["CVV"],
    expirymmyy: cardExp,
    transactionamount: tx["Amount"],
    transactiontype: "auth",
    tokenizedaccountnumber: "4111111111111111"
  };

  try {
    const response = await client.V1.authorize({ SbpRequest: args })
    return response.body;
  } catch (err) {
    console.log(err);
    return err;
  }
}

const validateTransaction = async (client, id) => {
  const args = {
    partnerkey: "21A47A5F-9992-46E5-A198-58756A38DDAF",
    partnerid: "pyds",
    orderid: id
  }
  
  try {
    const response = await client.V1.getReport({ SbpQueryRequest: args })
    return response.body;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = {
  getClient,
  batchTransactions,
  validateTransaction
};
