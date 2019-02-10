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
      "filenumber as FileNo",
      "debtorname as Debtor Name",
      "cardnumber as Card Number",
      "cardexpirationmonth as Expiration Month",
      "cardexpirationyear as Expiration Year",
      "threedigitnumber as CVV",
      "cardaddress as Address",
      "cardzipcode as Zip Code",
      "paymentamount as Amount"
    );

  // Find payments with entries in the processed database
  const processed = await collections("processed").select("id");

  // Convert sparse array to hash table for faster comparisons
  const hashed = {};
  processed.forEach(payment => (hashed[payment.id] = payment));
  console.log("duplicates");
  console.log(hashed);

  // Remove processed transactions from rows
  const rows = payments.filter(payment => !hashed[payment.id]);

  res.json({ rows });
});

server.get("/processed", async (req, res) => {
  const processed = await collections("payments")
    .join("processed", {
      "payments.id": "processed.id"
    })
    .select(
      "payments.debtorname as Debtor Name",
      "payments.filenumber as FileNo",
      "processed.refnum as ReferenceNo",
      "processed.timestamp as Timestamp"
    );
  console.log(processed);
  res.json({ rows: processed });
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
