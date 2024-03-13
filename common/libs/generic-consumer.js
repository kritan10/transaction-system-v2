import { KafkaConsumer } from "./kafka-consumer.js";

/**
 * Creates and runs a generic consumer.
 * @param {string} mcsName the name of the microservice
 * @param {string} topicsToConsume the topics to consume (must be string)
 * @param {string} consumerName the name of the consumer
 * @param {string} consumerGroup the name of the consumer group
 * @param {TopicEventMethodMap} topicEventMethodMap
 */
export const initGenericConsumer = async (mcsName, topicsToConsume, consumerName, consumerGroup, topicEventMethodMap) => {
  const topics = topicsToConsume.split(",");
  const consumer = await KafkaConsumer.createConsumer(consumerName, consumerGroup, { topics: topics, fromBeginning: false });
  await consumer.run({
    eachMessage: ({ topic, partition, message }) => {
      console.log(`MCS:${mcsName} | Topic:${topic} | Pt:${partition} `);
      const event = JSON.parse(message.value.toString());
      const method = topicEventMethodMap[topic][event.event_type];
      method(event);
    },
  });
};

/**
 * @typedef {Object.<string, TopicEventMethod>} TopicEventMethodMap
 * @property {TopicEventMethod}
 */

/**
 * @typedef {Object.<string, (event) => Promise<void>>} TopicEventMethod
 * @property {(event) => Promise<void>}
 */
