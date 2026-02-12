// // consumers/AuditConsumer.js
// import { Kafka } from "kafkajs";
// import AuditChain from "../audit/AuditChain.js";
// import MySQLAuditStore from "../audit/MySQLAuditStore.js";

// const kafka = new Kafka({
//   clientId: "audit-consumer",
//   brokers: ["localhost:9092"],
// });

// const consumer = kafka.consumer({ groupId: "audit-writers" });

// const auditChain = new AuditChain();
// const store = new MySQLAuditStore();

// await consumer.connect();
// await consumer.subscribe({ topic: "audit-events", fromBeginning: true });

// await consumer.run({
//   eachMessage: async ({ message }) => {
//     const event = JSON.parse(message.value.toString());
//     const chained = await auditChain.chain(event);
//     await store.append(chained);
//   },
// });
