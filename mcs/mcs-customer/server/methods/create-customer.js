import { v4 } from "uuid";

import { db } from "../sql/db.js";
import { KafkaProducer } from "../../../../common/libs/index.js";
import { AppEvents } from "../../../../common/events/index.js";

export async function createCustomer(call, callback) {
  const { request } = call;
  const customerId = v4();
  const insert = [customerId, request.name, request.passkey];

  const stmt = db.prepare(`INSERT INTO customers(uuid, name, passkey) VALUES (?,?,?)`);

  stmt.run(insert, (err) => {
    if (err) return callback(null, { status: 500, message: "Error creating account" });
  });

  await KafkaProducer.publish(AppEvents.Customer.CREATE_CUSTOMER_SUCCESS, { customerId: customerId, passkey: request.passkey });
  return callback(null, { status: 200, message: "CREATED" });
}
