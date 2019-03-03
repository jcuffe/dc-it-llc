const express = require("express");
const Customers = require("../models/customers/customers");
const router = express.Router();
const o2csv = require("objects-to-csv");
const moment = require("moment");
const { sftp, sftpOptions } = require("../util/sftp");

router.get("/customers", async (req, res) => {
  const rows = await Customers.all();
  res.json({ rows });
});

router.post("/", async (req, res) => {
  const rows = await Customers.all();
  csv = new o2csv(rows);
  csv.toString().then(str => {
    const dateStr = moment().format("YYYY-MM-DD");
    const path = `${process.env.FTP_ROOT}/DLC UPLOAD ${dateStr}.csv`;
    const client = sftp()
    client
      .connect(sftpOptions)
      .then(() => client.put(Buffer.from(str), path))
      .then(() => client.end())
      .then(() => res.json({ success: "Successfully exported CSV data" }))
      .catch((err) => {
        client.end();
        res.json({ error: "Failed to export. Wait a moment and try again.", err })
      });
  });
});

module.exports = router;
