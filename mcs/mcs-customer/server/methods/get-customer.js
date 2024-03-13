import { db } from "../sql/db.js";

export function getCustomer(call, callback) {
  const { request } = call;

  const query = `
  SELECT uuid,name,passkey,account_number,balance
  FROM customers INNER JOIN customer_accounts
  WHERE uuid=?`;

  db.get(query, [request.uuid], (err, result) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    if (!result) {
      return callback(null, { meta: { status: 404, message: "User not found" }, data: null });
    }
    return callback(null, { meta: { status: 200, message: "Success" }, data: result });
  });
}
