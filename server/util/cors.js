const cors = require("cors");

var config = {
  origin: "http://localhost:3000",
  method: ["GET", "POST"],
  credentials: true
};

module.exports = cors(config);
