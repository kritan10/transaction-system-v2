import sqlite from "sqlite3";
export const db = new sqlite.Database("./server/sql/transaction.db");

import { promisify } from "../../../../common/helpers/promisify.js";
export const dbAsync = promisify(db);

export async function dbInit() {
  await dbAsync.run(
    `CREATE TABLE IF NOT EXISTS customer_accounts (
      account_number TEXT PRIMARY KEY,
      customer TEXT,
      passkey TEXT,
      balance NUMBER,
      interest_rate NUMBER
    );
  `
  );

  await dbAsync.run(
    `CREATE TABLE IF NOT EXISTS transactions (
      transaction_id TEXT,
      initiator TEXT,
      recepient TEXT,
      amount NUMBER,
      is_completed BOOLEAN,
      date TEXT,
      FOREIGN KEY(initiator) REFERENCES customer_accounts(account_number),
      FOREIGN KEY(recepient) REFERENCES customer_accounts(account_number)
    );
  `
  );
}
