const express = require("express");
const passport = require("passport");
const router = express.Router();
const Users = require("../models/users/users");

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json(req.user);
});

router.get("/logout", (req, res) => {
  req.logOut();
});

router.get("/profile", (req, res) => {
  console.log("profile", req.user);
  res.json(req.user);
});

router.post("/adduser", async (req, res) => {
  const { username, password } = req.body;
  if (req.header("Authorization") == process.env.ADMIN_TOKEN) {
    const user = await Users.create(username, password);
    res.json(user);
  } else {
    res.json({ error: "Incorrect Authorization token" });
  }
});

module.exports = router;
