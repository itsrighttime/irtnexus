import Redis from "ioredis";
import { BaseEvent } from "../types/event";

type EventHandler = (event: BaseEvent) => Promise<void>;

export class RedisBus {
  private pub: Redis;
  private sub: Redis;
  private handlers: Map<string, Set<EventHandler>> = new Map();

  constructor(redisUrl: string) {
    this.pub = new Redis(redisUrl);
    this.sub = new Redis(redisUrl);

    // Listen to all incoming messages
    this.sub.on("message", async (channel: string, message: string) => {
      const eventType = this.extractEventType(channel);
      const handlers = this.handlers.get(channel);
      if (!handlers || handlers.size === 0) return;

      try {
        const event: BaseEvent = JSON.parse(message);
        for (const handler of handlers) {
          await handler(event);
        }
      } catch (err) {
        console.error("Error handling event:", err);
      }
    });
  }

  // -----------------------------
  // Publish an event
  // -----------------------------
  async publish(event: BaseEvent) {
    const channel = this.getChannel(event.eventType);
    await this.pub.publish(channel, JSON.stringify(event));
  }

  // -----------------------------
  // Subscribe to an event type
  // -----------------------------
  subscribe(eventType: string, handler: EventHandler) {
    const channel = this.getChannel(eventType);

    // Register handler
    if (!this.handlers.has(channel)) {
      this.handlers.set(channel, new Set());
      // Subscribe to Redis only once per channel
      this.sub.subscribe(channel, (err) => {
        if (err) console.error("Failed to subscribe:", err);
      });
    }
    this.handlers.get(channel)!.add(handler);
  }

  // -----------------------------
  // Unsubscribe a handler or all
  // -----------------------------
  unsubscribe(eventType: string, handler?: EventHandler) {
    const channel = this.getChannel(eventType);
    const handlers = this.handlers.get(channel);
    if (!handlers) return;

    if (handler) {
      handlers.delete(handler);
    } else {
      handlers.clear();
    }

    // Unsubscribe from Redis if no handlers left
    if (handlers.size === 0) {
      this.sub.unsubscribe(channel, (err) => {
        if (err) console.error("Failed to unsubscribe:", err);
      });
      this.handlers.delete(channel);
    }
  }

  // -----------------------------
  // Get subscriber count for a channel
  // -----------------------------
  getSubscriberCount(eventType: string): number {
    const channel = this.getChannel(eventType);
    return this.handlers.get(channel)?.size ?? 0;
  }

  // -----------------------------
  // Helper to construct Redis channel name
  // -----------------------------
  private getChannel(eventType: string) {
    // For normal events and request/reply channels
    return eventType.startsWith("reply:") ? eventType : `event:${eventType}`;
  }

  private extractEventType(channel: string) {
    if (channel.startsWith("event:")) return channel.slice(6);
    return channel; // reply channels or custom channels
  }
}
