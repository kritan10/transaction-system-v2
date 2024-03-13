import { db } from "../sql/db.js";

import { KafkaProducer } from "../../../../common/libs/kafka-producer.js";
import { AppEvents } from "../../../../common/events/index.js";

export function createCustomerAccount(event) {
  console.log(event);
  const { payload } = event;
  const insert = [payload.account_number, payload.customer, payload.balance];
  db.run(
    `
  INSERT INTO customer_accounts(account_number, customer, balance) 
  VALUES(?, ?, ?)
`,
    insert,
    async (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
}
