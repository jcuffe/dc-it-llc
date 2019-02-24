const cors = require("cors");

var config = {
  origin: process.env.FRONTEND_URL,
  method: ["GET", "POST"],
  credentials: true
};

module.exports = cors(config);
