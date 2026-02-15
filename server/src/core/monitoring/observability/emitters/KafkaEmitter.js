// emitters/KafkaEmitter.js
import { Kafka } from "kafkajs";
import { BaseEmitter } from "./BaseEmitter.js";

/**
 * KafkaEmitter
 *
 * Emits observability events to a Kafka topic.
 * Useful for high-throughput event streaming, audit pipelines, and analytics.
 *
 * Inherits from BaseEmitter and implements the required emit() method.
 */
export class KafkaEmitter extends BaseEmitter {
  /**
   * @param {Object} options
   * @param {string} options.clientId - Kafka client identifier
   * @param {string[]} options.brokers - List of Kafka broker addresses
   * @param {string} options.topic - Kafka topic to produce messages to
   */
  constructor({ clientId, brokers, topic }) {
    super();

    this.topic = topic;
    this.kafka = new Kafka({ clientId, brokers });
    this.producer = this.kafka.producer();
    this.connected = false; // track producer connection status
  }

  /**
   * Private method to ensure the Kafka producer is connected before sending messages
   */
  async #connect() {
    if (!this.connected) {
      await this.producer.connect();
      this.connected = true;
    }
  }

  /**
   * Emit an event to the configured Kafka topic
   *
   * @param {Object} event - Structured event payload
   * @returns {Promise<void>}
   */
  async emit(event) {
    await this.#connect();

    await this.producer.send({
      topic: this.topic,
      messages: [
        {
          key: event.eventType, // Use event type as Kafka message key
          value: JSON.stringify(event), // Serialize payload as JSON
        },
      ],
    });
  }
}
