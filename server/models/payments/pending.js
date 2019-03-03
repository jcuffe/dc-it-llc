const db = require("../../data/payments");
const Processed = require("./processed");

const all = async () => {
  let payments = [];
  try {
    payments = await db("payments")
      .where({ paymentstatus: "PENDING" })
      .select(
        "id",
        "filenumber as FileNo",
        "debtorname as Debtor Name",
        "cardnumber as Card Number",
        "cardexpirationmonth as Expiration Month",
        "cardexpirationyear as Expiration Year",
        "threedigitnumber as CVV",
        "cardaddress as Address",
        "cardzipcode as Zip Code",
        "paymentamount as Amount"
      );
  } catch (err) {
    console.log("Failed to fetch pending payments");
  }
  return payments;
};

const unprocessed = async () => {
  const payments = await all();
  const processed = await Processed.ids();
  const hashed = {};
  processed.forEach(payment => (hashed[payment.id] = payment));
  const rows = payments.filter(payment => !hashed[payment.id]);
  return rows;
};

module.exports = { all, unprocessed };
