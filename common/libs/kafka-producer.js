import { Kafka, Partitioners } from "kafkajs";

export class KafkaProducer {
  /**
   * Instantiate a singleton object for KafkaProducer.
   * @param {string} clientId
   * @param {import('kafkajs').ProducerConfig | null} config
   * @returns {import('kafkajs').Producer}
   */
  static async init(clientId, topic, config = null) {
    if (typeof KafkaProducer.instance === "object") {
      return KafkaProducer.instance;
    }
    const kafka = new Kafka({ clientId: clientId, brokers: ["localhost:9092"] });
    const producer = kafka.producer(config ?? { allowAutoTopicCreation: false, createPartitioner: Partitioners.LegacyPartitioner });
    KafkaProducer._topic = topic;
    KafkaProducer.instance = producer;
    return KafkaProducer.instance;
  }

  /**
   * Get an instance of this producer.
   * @returns {import('kafkajs').Producer}
   */
  static getInstance() {
    if (typeof KafkaProducer.instance === "object") {
      return KafkaProducer.instance;
    }
    throw new Error("Not initialized");
  }

  /**
   * Helper publish method.
   * @param {string} event The name of the event
   * @param {object} payload The event details (this will be JSON.stringified)
   */
  static async publish(event, payload) {
    const producer = KafkaProducer.getInstance();
    await producer.connect();
    const message = { event_type: event, payload: payload, produced_by: this._producerId, timestamp: Date.now().toString() };
    await producer.send({ topic: KafkaProducer._topic, messages: [{ value: JSON.stringify(message) }] });
    await producer.disconnect();
  }
}
