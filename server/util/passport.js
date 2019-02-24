const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Users = require("../models/users/users");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await Users.authenticate(username, password);
      return done(null, user);
    } catch (err) {
      return done(null, false, { message: err });
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
});

module.exports = passport;
