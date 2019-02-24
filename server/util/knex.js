const knex = require("knex");

const db = knex({
  client: "mysql",
  connection: {
    host: "72.52.128.231",
    user: "root",
    password: "Enterprise1",
    database: "collectionsmax"
  }
});

module.exports = db;
