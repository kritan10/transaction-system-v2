import { db } from "../sql/db.js";

import { KafkaProducer } from "../../../../common/libs/kafka-producer.js";
import { AppEvents } from "../../../../common/events/index.js";

export function updateCustomerBalance(event) {
  const { payload } = event;
  const insert = [payload.newBalance, payload.account];
  console.log(payload);
  const stmt = db.prepare(`UPDATE customer_accounts SET balance=? WHERE account_number=?`);

  stmt.run(insert, async (err) => {
    if (err) {
      console.log(err);
    }
  });
}
