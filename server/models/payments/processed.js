const db = require("../../util/knex");

const all = async () => {
  // TODO catch
  const processed = await db("payments")
    .join("processed", {
      "payments.id": "processed.id"
    })
    .select(
      "payments.debtorname as Debtor Name",
      "payments.filenumber as FileNo",
      "processed.refnum as ReferenceNo",
      "processed.timestamp as Timestamp"
    );
  return processed;
};

const ids = async () => {
  // TODO catch
  const ids = await db("processed").select("id");
  return ids;
};

// Create a row in processed table to indicate our intent to run a transaction
const insertTransaction = async tx => {
  try {
    await db("processed").insert({ id: tx.id });
  } catch (err) {
    console.log("Failed to insert payment.");
    console.log(err.sqlMessage);
  }
};

// Fetch all transactions which have not been finalized
const unfinalized = async () => {
  try {
    const rows = await db("processed").where({ refnum: null });
    return rows;
  } catch (err) {
    console.log("Failed to fetch unfinalized payments.");
    console.log(err);
  }
};

const removeTransaction = async id => {
  try {
    await db("processed")
      .where({ id })
      .del();
  } catch (err) {
    console.log("Failed to delete payment.");
  }
};

// Update a row in the processed table with a refnum which indicates
// a successful transaction
const finalizeTransaction = async (id, refnum) => {
  try {
    await db("processed")
      .where({ id })
      .update({ refnum });
  } catch (err) {
    console.log("Failed to finalize transaction.");
    console.log(err.sqlMessage);
  }
};

module.exports = {
  all,
  ids,
  insertTransaction,
  finalizeTransaction,
  removeTransaction
};
