const db = require("../../util/userdb");
const bcrypt = require("bcrypt");

const create = async (username, password) => {
  let hash, user;
  try {
    hash = await bcrypt.hash(password, 10);
  } catch (err) {
    console.log("Unable to encrypt password.");
    console.log(err);
    return null;
  }

  try {
    const id = (await db("users")
      .insert({ username, password: hash })
      .returning("id"))[0];
    user = await findById(id);
    return user;
  } catch (err) {
    console.log("Unable to create user.");
    console.log(err);
    return null;
  }
};

const findById = async id => {
  console.log(id, typeof id);
  try {
    const user = await db("users")
      .where({ id })
      .first();
    return user;
  } catch (err) {
    console.log(`Unable to find user with id ${id}`);
    console.log(err);
    return null;
  }
};

const authenticate = async (username, password) => {
  try {
    const user = await db("users")
      .where({ username })
      .first();
    const authenticated = await bcrypt.compare(password, user.password);
    if (authenticated) {
      return user;
    } else {
      throw "Invalid Password.";
    }
  } catch (err) {
    console.log("Unable to authenticate user.");
    console.log(err);
    return null;
  }
};

module.exports = { create, findById, authenticate };
