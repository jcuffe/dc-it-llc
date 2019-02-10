// Configure environment before imports
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("./util/cors");
const { collections, processedPayments } = require("./util/knex");
const { getSoapClient, DCITReport, runTransaction } = require("./util/soap");

server = express();
server.use(cors());
server.use(express.json());

server.get("/dcit", async (req, res) => {
  const client = await getSoapClient();
  dcit = await DCITReport(client);
  res.json(dcit);
});

server.get("/payments", async (req, res) => {
  const payments = await collections("payments")
    .where({ paymentstatus: "PENDING" })
    .select(
      "id",
      "debtorname as Debtor Name",
      "cardnumber as Card Number",
      "cardexpirationmonth as Expiration Month",
      "cardexpirationyear as Expiration Year",
      "cardaddress as Address",
      "cardzipcode as Zip Code"
    );

  // Find payments with entries in the processed database
  const processed = (await Promise.all(
    payments.map(({ id }) =>
      processedPayments("payments")
        .where({ id })
        .first()
    )
  )).filter(payment => payment);

  console.log(`> ${processed.length} entries already processed, ignoring`);

  // Convert sparse array to hash table for faster comparisons
  const hashed = {};
  processed.forEach(payment => (hashed[payment.id] = payment));

  // Remove processed transactions from rows
  const rows = payments.filter(payment => !hashed[payment.id]);

  res.json({ rows });
});

server.post("/process", async (req, res) => {
  const client = await getSoapClient();
  const txs = req.body;
  const results = await Promise.all(txs.map(tx => runTransaction(client, tx)));
  const responses = [];
  txs.forEach(async (tx, i) => {
    const result = results[i].Result.$value;
    if (result === "Approved") {
      const refnum = results[i].RefNum.$value;
      console.log(result, tx.id);
      responses.push({
        id: tx.id,
        "Debtor Name": tx["Debtor Name"],
        Result: result,
        ReferenceNo: refnum
      });
      const id = await collections("processed")
        .insert({ id: tx.id, refnum })
        .returning("refnum");
      console.log(`Processed ${tx.id}`);
    } else {
      const error = results[i].Error.$value;
      responses.push({
        id: tx.id,
        "Debtor Name": tx["Debtor Name"],
        Result: error,
        ReferenceNo: null
      });
    }
  });
  return res.json(responses);
});

server.get("*", (req, res) => {
  res.send("Hola");
});

const port = process.env.PORT || 5000;
server.listen(port, err => {
  if (err) throw err;
  console.log(`> Listening on ${port}`);
});
