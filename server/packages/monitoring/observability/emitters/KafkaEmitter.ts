// import { Kafka, Producer } from "kafkajs";
// import { BaseEmitter } from "./BaseEmitter";

// export interface KafkaEmitterOptions {
//   clientId: string;
//   brokers: string[];
//   topic: string;
// }

// /**
//  * KafkaEmitter
//  *
//  * Emits observability events to a Kafka topic.
//  * Useful for high-throughput event streaming, audit pipelines, and analytics.
//  */
// export class KafkaEmitter<
//   TEvent extends { eventType?: string },
// > extends BaseEmitter<TEvent> {
//   private kafka: Kafka;
//   private producer: Producer;
//   private topic: string;
//   private connected = false;

//   constructor({ clientId, brokers, topic }: KafkaEmitterOptions) {
//     super();
//     this.topic = topic;
//     this.kafka = new Kafka({ clientId, brokers });
//     this.producer = this.kafka.producer();
//   }

//   /**
//    * Ensure Kafka producer is connected before sending messages
//    */
//   private async connect(): Promise<void> {
//     if (!this.connected) {
//       await this.producer.connect();
//       this.connected = true;
//     }
//   }

//   /**
//    * Emit an event to the configured Kafka topic
//    */
//   async emit(event: TEvent): Promise<void> {
//     await this.connect();

//     await this.producer.send({
//       topic: this.topic,
//       messages: [
//         {
//           key: event.eventType ?? undefined,
//           value: JSON.stringify(event),
//         },
//       ],
//     });
//   }

//   /**
//    * Optional: disconnect producer (graceful shutdown)
//    */
//   async disconnect(): Promise<void> {
//     if (this.connected) {
//       await this.producer.disconnect();
//       this.connected = false;
//     }
//   }
// }
