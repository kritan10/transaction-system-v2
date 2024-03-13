import { db } from "../sql/db.js";
import { generateAccountNumber } from "../helpers/generate-account-number.js";

import { KafkaProducer } from "../../../../common/libs/kafka-producer.js";
import { AppEvents } from "../../../../common/events/index.js";

export function createAccount(event) {
  const { payload } = event;
  console.log(payload);
  const inserts = [generateAccountNumber(), payload.customerId, payload.passkey, 0, 5];
  db.get(
    `
    INSERT INTO customer_accounts(account_number, customer, passkey, balance, interest_rate) 
    VALUES (?,?,?,?,?)
    RETURNING account_number,customer,balance
  `,
    inserts,
    async (err, res) => {
      if (err) {
        console.log(err);
        return await KafkaProducer.publish(AppEvents.Transaction.CREATE_CUSTOMER_ACCOUNT_FAILURE);
      }
      console.log(res);
      return await KafkaProducer.publish(AppEvents.Transaction.CREATE_CUSTOMER_ACCOUNT_SUCCESS, res);
    }
  );
}
