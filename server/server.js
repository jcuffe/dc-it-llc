// Configure environment before imports
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("./util/cors");
const session = require("./util/session");
const passport = require("./util/passport");
const paymentRoutes = require("./routes/payments");
const authRoutes = require("./routes/auth");
const exportRoutes = require("./routes/export");

server = express();
server.use(cors);
server.use(express.json());
server.use(session);
server.use(passport.initialize());
server.use(passport.session());

server.use("/auth", authRoutes);
server.use("/payments", paymentRoutes);
server.use("/export", exportRoutes);

server.get("/dcit", async (req, res) => {
  const client = await getSoapClient();
  dcit = await DCITReport(client);
  res.json(dcit);
});

const port = process.env.PORT || 5000;
server.listen(port, err => {
  if (err) throw err;
  console.log(`> Listening on ${port}`);
});
