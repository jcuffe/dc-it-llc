// Configure environment before imports
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const db = require("./util/knex");
const { getSoapClient, DCITReport, batchTransactions } = require("./util/soap");
const sftp = require("./util/sftp");
const o2csv = require("objects-to-csv");
const moment = require("moment");
const cors = require("./util/cors");
const session = require("./util/session");
const passport = require("./util/passport");
const paymentRoutes = require("./routes/payments");
const authRoutes = require("./routes/auth");
const Customers = require("./models/customers/customers");
const Pending = require("./models/payments/pending");
const Processed = require("./models/payments/processed");

server = express();
server.use(cors);
server.use(express.json());
server.use(session);
server.use(passport.initialize());
server.use(passport.session());

server.post("/test", (req, res) => {
  res.json({ message: "received", body: req.body });
});

server.use("/auth", authRoutes);
//server.use(paymentRoutes);

server.get("/dcit", async (req, res) => {
  const client = await getSoapClient();
  dcit = await DCITReport(client);
  res.json(dcit);
});

server.get("/customers", async (req, res) => {
  const rows = await Customers.all();
  res.json({ rows });
});

server.post("/csv-export", async (req, res) => {
  const rows = await Customers.all();
  csv = new o2csv(rows);
  csv.toString().then(str => {
    const dateStr = moment().format("YYYY-MM-DD");
    const path = `${process.env.FTP_ROOT}/DLC UPLOAD ${dateStr}.csv`;
    sftp
      .connect()
      .then(() => {
        return sftp.put(new Buffer(str), path);
      })
      .then(data => console.log(data))
      .then(() =>
        res.status(200).json({
          message: `Successfully sent ${rows.length} records.`
        })
      );
  });
});

server.get("/payments", async (req, res) => {
  const rows = await Pending.unprocessed();
  if (rows.length) {
    res.json({ rows });
  } else {
    res.json({ error: "Unable to fetch pending payments" });
  }
});

server.get("/processed", async (req, res) => {
  const rows = await Processed.all();
  res.json({ rows });
});

server.post("/process", async (req, res) => {
  const client = await getSoapClient();
  const transactions = req.body;
  const results = await batchTransactions(client, transactions);
  return res.json(results);
});

const port = process.env.PORT || 5000;
server.listen(port, err => {
  if (err) throw err;
  console.log(`> Listening on ${port}`);
});
