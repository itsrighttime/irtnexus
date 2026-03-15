import Redis from "ioredis";
import { BaseEvent } from "../types/event";
import { logger } from "#utils";

type EventHandler = (event: BaseEvent) => Promise<void>;

export class RedisBus {
  private pub: Redis;
  private sub: Redis;
  private handlers: Map<string, Set<EventHandler>> = new Map();

  constructor(redisUrl: string) {
    this.pub = new Redis(redisUrl);
    this.sub = new Redis(redisUrl);

    logger.info(`[redis-bus] RedisBus connecting to ${redisUrl}`);

    // Listen to all incoming messages
    this.sub.on("message", async (channel: string, message: string) => {
      const handlers = this.handlers.get(channel);
      if (!handlers || handlers.size === 0) return;

      try {
        const event: BaseEvent = JSON.parse(message);
        logger.debug(`[redis-bus] Received event ${event.eventType}`, event);

        for (const handler of handlers) {
          await handler(event);
        }
      } catch (err: any) {
        logger.error(
          `[redis-bus] Error handling message on channel ${channel}`,
          err,
        );
      }
    });

    this.sub.on("connect", () =>
      logger.info("[redis-bus] Redis subscriber connected"),
    );
    this.pub.on("connect", () =>
      logger.info("[redis-bus] Redis publisher connected"),
    );
    this.sub.on("error", (err) =>
      logger.error("[redis-bus] Redis subscriber error", err),
    );
    this.pub.on("error", (err) =>
      logger.error("[redis-bus] Redis publisher error", err),
    );
  }

  // -----------------------------
  // Publish an event
  // -----------------------------
  async publish(event: BaseEvent) {
    const channel = this.getChannel(event.eventType);
    await this.pub.publish(channel, JSON.stringify(event));
    logger.info(
      `[redis-bus] Published event ${event.eventType} on channel ${channel}`,
      event,
    );
  }

  // -----------------------------
  // Subscribe to an event type
  // -----------------------------
  subscribe(eventType: string, handler: EventHandler) {
    const channel = this.getChannel(eventType);

    if (!this.handlers.has(channel)) {
      this.handlers.set(channel, new Set());
      this.sub.subscribe(channel, (err) => {
        if (err) {
          logger.error(
            `[redis-bus] Failed to subscribe to channel ${channel}`,
            err,
          );
        } else {
          logger.info(`[redis-bus] Subscribed to channel ${channel}`);
        }
      });
    }
    this.handlers.get(channel)!.add(handler);
    logger.debug(`[redis-bus] Handler added for channel ${channel}`);
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
      logger.debug(`[redis-bus] Handler removed from channel ${channel}`);
    } else {
      handlers.clear();
      logger.info(`[redis-bus] All handlers removed from channel ${channel}`);
    }

    if (handlers.size === 0) {
      this.sub.unsubscribe(channel, (err) => {
        if (err) {
          logger.error(
            `[redis-bus] Failed to unsubscribe from channel ${channel}`,
            err,
          );
        } else {
          logger.info(`[redis-bus] Unsubscribed from channel ${channel}`);
        }
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
    return eventType.startsWith("reply:") ? eventType : `event:${eventType}`;
  }

  private extractEventType(channel: string) {
    if (channel.startsWith("event:")) return channel.slice(6);
    return channel;
  }
}
