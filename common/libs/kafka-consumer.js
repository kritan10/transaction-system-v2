import { Kafka } from "kafkajs";

export class KafkaConsumer {
  /**
   * Create an object of KafkaConsumer.
   * @param {string} clientId the client id of this consumer
   * @param {string} groupId the group id of this consumer
   * @param {import('kafkajs').ConsumerSubscribeTopics} topics the topics to subscribe/consume
   * @returns {Promise<import('kafkajs').Consumer>}
   */
  static async createConsumer(clientId, groupId, topics) {
    const kafka = new Kafka({ clientId: clientId, brokers: ["localhost:9092"] });
    const instance = kafka.consumer({ groupId: groupId });
    await instance.connect();
    await instance.subscribe(topics);
    return instance;
  }
}
