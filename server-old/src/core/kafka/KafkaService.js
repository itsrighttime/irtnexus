// core/KafkaService.js
import { Kafka, logLevel } from "kafkajs";
import { observability, prometheusRegistry } from "#core";

export class KafkaService {
  constructor({ clientId, brokers, environment }) {
    this.kafka = new Kafka({ clientId, brokers, logLevel: logLevel.INFO });
    this.environment = environment || "dev";
    this.producerInstance = null;
    this.consumers = new Map();
  }

  /** -------------------------
   * Producer
  ------------------------- */
  async producer() {
    if (!this.producerInstance) {
      this.producerInstance = this.kafka.producer();
      await this.producerInstance.connect();
    }
    return this.producerInstance;
  }

  /**
   * Send messages to a Kafka topic
   * @param {string} topic - Topic name
   * @param {object|object[]} messages - Payload(s)
   * @param {number} retries - Retry attempts
   */
  async send(topic, messages, retries = 3) {
    const producer = await this.producer();
    const payloads = (Array.isArray(messages) ? messages : [messages]).map(
      (msg) => ({ value: JSON.stringify(msg) }),
    );

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await producer.send({
          topic: `${this.environment}.${topic}`,
          messages: payloads,
        });
        // Metrics
        prometheusRegistry?.recordBusinessEvent({
          name: "kafka_send",
          success: true,
        });
        return true;
      } catch (err) {
        prometheusRegistry?.recordBusinessEvent({
          name: "kafka_send",
          success: false,
        });
        observability?.logSystemEvent({
          name: "kafka_send_failed",
          metadata: { topic, attempt, error: err.message },
          severity: "WARN",
        });
        if (attempt === retries) throw err;
        await new Promise((r) => setTimeout(r, attempt * 500)); // exponential backoff
      }
    }
  }

  /** -------------------------
   * Consumer
  ------------------------- */
  async consume(topic, groupId, handler) {
    const consumerKey = `${topic}:${groupId}`;
    if (this.consumers.has(consumerKey)) return this.consumers.get(consumerKey);

    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({
      topic: `${this.environment}.${topic}`,
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const payload = JSON.parse(message.value.toString());
          await handler(payload);
        } catch (err) {
          observability?.logSystemEvent({
            name: "kafka_consume_failed",
            metadata: { topic, error: err.message },
            severity: "ERROR",
          });
          // Optionally push to DLQ
        }
      },
    });

    this.consumers.set(consumerKey, consumer);
    return consumer;
  }

  async disconnect() {
    if (this.producerInstance) await this.producerInstance.disconnect();
    for (const consumer of this.consumers.values()) await consumer.disconnect();
  }
}
