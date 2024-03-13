import { Kafka } from "kafkajs";

(async () => {
  const kafka = new Kafka({ clientId: "admin", brokers: ["localhost:9092"] });
  const admin = kafka.admin({});
  try {
    await admin.connect();
    console.log("START DELETE");
    // await admin.listTopics();
    await admin.deleteTopics({ topics: ["customers", "transactions"] });
    console.log("END DELETE");
    process.exit(0);
  } catch (error) {
    console.error(error);
  } finally {
    await admin.disconnect();
  }
})();
