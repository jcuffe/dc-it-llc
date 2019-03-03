const express = require("express");
const Pending = require("../models/payments/pending");
const Processed = require("../models/payments/processed");
const processors = require("../payments/processors");

const router = express.Router();

router.get("/pending", async (req, res) => {
  const rows = await Pending.unprocessed();
  if (rows.length) {
    res.json({ rows });
  } else {
    res.json({ error: "Unable to fetch pending payments" });
  }
});

router.get("/processed", async (req, res) => {
  const rows = await Processed.all();
  res.json({ rows });
});

router.post("/process", async (req, res) => {
  // TODO choose processing library based on user data
  const processorStr = req.user.processor || "billingTree";
  const processor = processors[processorStr];

  console.log("Processing payments");
  console.log(`Client processor: ${req.user.processor}`);
  console.log("Pending payment IDS:", req.body);

  const client = await processor.getClient();
  const transactions = req.body;
  const results = await processor.batchTransactions(client, transactions);
  return res.json(results);
});

module.exports = router;
