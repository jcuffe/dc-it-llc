const knex = require("knex");

const collections = knex({
  client: "mysql",
  connection: {
    host: "72.52.128.231",
    user: "root",
    password: "Enterprise1",
    database: "collectionsmax"
  }
});

const processedPayments = knex({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "Enterprise1",
    database: "dc-it-llc"
  }
});

module.exports = { collections, processedPayments };
