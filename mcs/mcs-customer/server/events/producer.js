import { KafkaProducer } from "../../../../common/libs/index.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * Generic method to publish events.
 * @param {string} topic The topic to send to.
 * @param {string} eventType Event type.
 * @param {object} payload Event payload.
 */
export async function publish(topic, eventType, payload) {
  const producer = KafkaProducer.getInstance();
  await producer.connect();
  /**@type {CustomerEvent} */
  const message = { event_type: eventType, payload: JSON.stringify(payload), produced_by: process.env.MCS_NAME, timestamp: Date.now().toString() };
  // Topic will be customer
  await producer.send({ topic: topic, messages: [message] });
  console.log("Message Sent.");
  await producer.disconnect();
  console.log("Disconnected.");
}

export async function rpc(){
  // return Promise.race([])
  return new Promise((resolve, reject) => {
  
  })
}

/**
 * @typedef {Object} CustomerEvent
 * @property {string} event_type The event type... predefine values for this
 * @property {string} timestamp The creation time of this event.
 * @property {object} payload Any additional payload, details that might be required.
 * @property {string} produced_by The name of the microservice that produces the event.
 *
 */

