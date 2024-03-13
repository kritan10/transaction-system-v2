import { db, dbAsync } from "../sql/db.js";
import { KafkaProducer } from "../../../../common/libs/index.js";
import { AppEvents } from "../../../../common/events/index.js";

export async function loadBalance(call, callback) {
  const { account, amount } = call.request;

  const customer = await dbAsync.get(`SELECT customer FROM customer_accounts WHERE account_number=?`, [account]);
  if (!customer) {
    return callback(null, { status: 400, message: "Invalid account number" });
  }

  await dbAsync.run("BEGIN TRANSACTION");
  const newBalance = await dbAsync.get(`UPDATE customer_accounts SET balance = balance + ? WHERE account_number=? RETURNING balance`, [amount, account]);
  const insert = ["SYSTEM", account, amount, true, Date.now().toString()];
  await dbAsync.run(`INSERT INTO transactions(initiator,recepient,amount,is_completed,date) VALUES (?,?,?,?,?)`, insert);
  await dbAsync.run(`COMMIT`);

  await KafkaProducer.publish(AppEvents.Transaction.BALANCE_CHANGE, { account: account, newBalance: newBalance.balance });
  return callback(null, { status: 200, message: "CREATED" });
}
