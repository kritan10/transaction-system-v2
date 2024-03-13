import { v4 } from "uuid";

import { db, dbAsync } from "../sql/db.js";
import { KafkaProducer } from "../../../../common/libs/index.js";
import { AppEvents } from "../../../../common/events/index.js";

export async function transferBalance(call, callback) {
  const { from, to, amount, passkey } = call.request;

  const customer = await dbAsync.get(`SELECT passkey, balance FROM customer_accounts WHERE account_number=?`, [from]);
  if (!customer) {
    return callback(null, { status: 400, message: "Invalid account number" });
  }
  if (customer.balance < amount) {
    return callback(null, { status: 400, message: "Insufficient amount" });
  }
  if (customer.passkey != passkey) {
    return callback(null, { status: 401, message: "Invalid password" });
  }

  await dbAsync.run("BEGIN TRANSACTION");
  const fromNewBalance = await dbAsync.run(`UPDATE customer_accounts SET balance = balance - ? WHERE account_number=? RETURNING balance`, [amount, from]);
  const toNewBalance = await dbAsync.run(`UPDATE customer_accounts SET balance = balance + ? WHERE account_number=? RETURNING balance`, [amount, to]);

  const insert = [from, to, amount, true, Date.now().toString()];
  await dbAsync.run(`INSERT INTO transactions(initiator,recepient,amount,is_completed,date) VALUES (?,?,?,?,?)`, insert);
  await dbAsync.run(`COMMIT`);

  await Promise.all([
    KafkaProducer.publish(AppEvents.Transaction.BALANCE_CHANGE, { account: from, newBalance: fromNewBalance }),
    KafkaProducer.publish(AppEvents.Transaction.BALANCE_CHANGE, { account: to, newBalance: toNewBalance }),
  ]);
  return callback(null, { status: 200, message: "CREATED" });
}
