import sqlite from "sqlite3";
import { v4 } from "uuid";
import { generateAccountNumber } from "../helpers/generate-account-number";
const db = new sqlite.Database("./server/sql/customer.db");

(function () {
  const customers = ["Julian", "Ricky", "Bubbles", "Trevor", "Cory"];
  db.run("BEGIN TRANSACTION;");
  customers.forEach((c) => {
    const uuid = v4();
    db.run(`INSERT INTO customers(uuid, name, passkey) VALUES (${uuid}, ${c}, "1234");`);
    db.run(`INSERT INTO customers_account(customer,acc_number,balance) VALUES (${uuid}, ${generateAccountNumber}, 0);`);
  });
})();
