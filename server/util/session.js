const session = require("express-session");

const config = {
  secret: "dc-it-llc",
  resave: false,
  saveUninitialized: false
};

module.exports = session(config);
