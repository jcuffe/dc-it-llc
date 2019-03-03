const db = require("../../data/payments");

const all = async () => {
  const rows = await db("dbase")
    .join("payments", "dbase.filenumber", "=", "payments.filenumber")
    .where("cellphone", "!=", "")
    .select(
      "dbase.id",
      "dbase.accountnumber",
      "dbase.socialsecuritynumber as SSN",
      "firstname",
      "lastname",
      "state",
      "zip",
      "lastpaymentamount",
      "currentbalance",
      "paymentdate",
      "cellphone",
      "paymentstatus"
    );
  return rows;
};

module.exports = { all };
