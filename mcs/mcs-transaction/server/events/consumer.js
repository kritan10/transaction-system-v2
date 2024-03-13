import dotenv from "dotenv";
dotenv.config();

import { createAccount } from "../methods/index.js";

import { AppEvents } from "../../../../common/events/index.js";
import { initGenericConsumer } from "../../../../common/libs/generic-consumer.js";

export default async function initConsumer(consumerPort) {
  const topicEventMethodMap = {
    [AppEvents.Customer.TOPIC]: {
      [AppEvents.Customer.CREATE_CUSTOMER_SUCCESS]: createAccount,
    },
  };

  await initGenericConsumer(
    process.env.MCS_NAME,
    process.env.KAFKA_CONSUME_TOPICS, // dont line break
    "transactionconsumer" + consumerPort,
    "transactiongroup",
    topicEventMethodMap
  );
}
