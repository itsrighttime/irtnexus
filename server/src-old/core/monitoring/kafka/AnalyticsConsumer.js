// // consumers/AnalyticsConsumer.js
// import { Kafka } from "kafkajs";

// const kafka = new Kafka({
//   clientId: "analytics-consumer",
//   brokers: ["localhost:9092"],
// });

// const consumer = kafka.consumer({ groupId: "analytics-processors" });

// await consumer.connect();
// await consumer.subscribe({ topic: "analytics-events" });

// await consumer.run({
//   eachMessage: async ({ message }) => {
//     const event = JSON.parse(message.value.toString());

//     // Examples:
//     // - Store in OLAP DB
//     // - Feed dashboards
//     // - Train ML models
//     // - Detect usage trends
//   },
// });
