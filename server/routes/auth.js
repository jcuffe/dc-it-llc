const express = require("express");
const passport = require("passport");
const router = express.Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("User", req.user);
  res.json(req.user);
});

router.get("/logout", (req, res) => {
  req.logOut();
});

module.exports = router;
