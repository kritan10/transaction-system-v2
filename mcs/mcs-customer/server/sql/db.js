import sqlite from "sqlite3";
export const db = new sqlite.Database("./server/sql/customer.db");

import { promisify } from "../../../../common/helpers/index.js";
export const dbAsync = promisify(db);

export async function dbInit() {
  await dbAsync.run(
    `CREATE TABLE IF NOT EXISTS customers (
      uuid TEXT PRIMARY KEY,
      name TEXT,
      passkey TEXT
    );
  `
  );
  await dbAsync.run(
    `CREATE TABLE IF NOT EXISTS customer_accounts (
      account_number TEXT PRIMARY KEY,
      customer TEXT,
      balance TEXT,
      FOREIGN KEY(customer) REFERENCES customers(uuid)
    );
  `
  );
}
