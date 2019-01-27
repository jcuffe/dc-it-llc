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
      "cardexpirationmonth as Card Expiration Month",
      "cardexpirationyear as Card Expiration Year",
      "cardaddress as Card Address",
      "cardzipcode as Card Zip Code"
    );

  // Find payments with entries in the processed database
  const processed = payments.map(payment =>
    processedPayments("payments")
      .where(payment)
      .first()
  );

  // Convert sparse array to hash table for faster comparisons
  const hashed = {};
  (await Promise.all(processed))
    .filter(payment => payment)
    .forEach(payment => (hashed[payment.id] = payment));

  // Remove processed transactions from rows
  const rows = payments.filter(payment => hashed[payment.id]);

  res.json({ rows });
});

server.post("/process", async (req, res) => {
  const client = await getSoapClient();
  const result = await runTransaction(client, req.body);
  console.log(result);
  // TODO check result for success
  if (result) {
    const id = await processedPayments("payments").insert(req.body);
    console.log(`Processed ${id}`);
    return res.json({ success: "success" });
  }
  res.json({ err: "failed to process" });
});

server.get("*", (req, res) => {
  res.send("Hola");
});

server.listen(5000, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${5000}`);
});
