import dotenv from "dotenv";
dotenv.config();

import { AppEvents } from "../../../../common/events/index.js";
import { initGenericConsumer } from "../../../../common/libs/generic-consumer.js";

// import { updateCustomer } from '../methods/update-customer.js';
import { updateCustomerBalance } from "../methods/update-customer-balance.js";
import { createCustomerAccount } from "../methods/create-customer-account.js";

export default async function initConsumer(consumerPort) {
  const topicEventMethodMap = {
    [AppEvents.Transaction.TOPIC]: {
      [AppEvents.Transaction.CREATE_CUSTOMER_ACCOUNT_SUCCESS]: createCustomerAccount,
      [AppEvents.Transaction.BALANCE_CHANGE]: updateCustomerBalance,
    },
  };

  const consumer = await initGenericConsumer(
    process.env.MCS_NAME,
    process.env.KAFKA_CONSUME_TOPICS, // dont line break
    "customerconsumer" + consumerPort,
    "customergroup",
    topicEventMethodMap
  );
}
