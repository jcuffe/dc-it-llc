const cors = require("cors");

var corsOptions = {
  origin: "http://localhost:3000"
};

module.exports = () => cors(corsOptions);
