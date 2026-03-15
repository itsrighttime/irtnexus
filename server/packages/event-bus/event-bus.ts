import { BaseEvent, validateEvent } from "./types/event";
import { RedisBus } from "./transport/redis-bus";
import { eventQueue } from "./queue/bullmq-queues";
import { generateUUID } from "../utils";

type EventHandler = (event: BaseEvent) => Promise<void>;
type Middleware = (
  event: BaseEvent,
  next: () => Promise<void>,
) => Promise<void>;

export class EventBus {
  private redisBus: RedisBus;
  private middlewares: Middleware[] = [];

  constructor(redisUrl: string) {
    this.redisBus = new RedisBus(redisUrl);
  }

  // -----------------------------
  // Core publishing
  // -----------------------------
  async publish(event: Omit<BaseEvent, "eventId" | "timestamp">) {
    const fullEvent: BaseEvent = {
      ...event,
      eventId: generateUUID(),
      timestamp: new Date().toISOString(),
    };

    // Validation
    if (!fullEvent.eventId || !fullEvent.eventType || !fullEvent.tenantId) {
      throw new Error("Invalid event structure");
    }
    if (!validateEvent(fullEvent)) {
      throw new Error("Invalid event structure");
    }

    // Middleware execution
    await this.executeMiddlewares(fullEvent);

    // Real-time Pub/Sub
    await this.redisBus.publish(fullEvent);

    // Async job queue
    await eventQueue.add(fullEvent.eventType, fullEvent);
  }

  // -----------------------------
  // Delayed / scheduled events
  // -----------------------------
  async publishDelayed(
    event: Omit<BaseEvent, "eventId" | "timestamp">,
    delayMs: number,
  ) {
    const fullEvent: BaseEvent = {
      ...event,
      eventId: generateUUID(),
      timestamp: new Date().toISOString(),
    };
    await eventQueue.add(fullEvent.eventType, fullEvent, { delay: delayMs });
  }

  // -----------------------------
  // Batch publishing
  // -----------------------------
  async publishBatch(events: Omit<BaseEvent, "eventId" | "timestamp">[]) {
    for (const event of events) {
      await this.publish(event);
    }
  }

  // -----------------------------
  // Subscriptions
  // -----------------------------
  subscribe(eventType: string | string[], handler: EventHandler) {
    if (Array.isArray(eventType)) {
      for (const type of eventType) {
        this.redisBus.subscribe(type, handler);
      }
    } else {
      this.redisBus.subscribe(eventType, handler);
    }
  }

  unsubscribe(eventType: string, handler?: EventHandler) {
    this.redisBus.unsubscribe(eventType, handler);
  }

  // -----------------------------
  // Request/Reply (RPC-style)
  // -----------------------------
  async request<T = any>(
    eventType: string,
    payload: any,
    timeout = 5000,
  ): Promise<T> {
    const correlationId = generateUUID();
    const replyChannel = `reply:${correlationId}`;

    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.redisBus.unsubscribe(replyChannel);
        reject(new Error("Request timed out"));
      }, timeout);

      this.redisBus.subscribe(replyChannel, async (event: BaseEvent) => {
        clearTimeout(timeoutId);
        this.redisBus.unsubscribe(replyChannel);
        resolve(event.payload as T);
      });

      this.publish({
        eventType,
        tenantId: "system",
        payload: { ...payload, correlationId, replyChannel },
      });
    });
  }

  // -----------------------------
  // Replay / Recovery (optional)
  // -----------------------------
  async replay(eventType: string, since?: Date) {
    // Placeholder: you can store recent events in Redis or DB
    console.log(`Replaying events for ${eventType} since ${since}`);
  }

  // -----------------------------
  // Middleware support
  // -----------------------------
  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  private async executeMiddlewares(event: BaseEvent) {
    let index = -1;
    const run = async () => {
      index++;
      if (index < this.middlewares.length) {
        await this.middlewares[index](event, run);
      }
    };
    await run();
  }

  // -----------------------------
  // Health / Monitoring
  // -----------------------------
  async getQueueStats() {
    const jobCounts = await eventQueue.getJobCounts();
    return jobCounts; // { waiting, active, completed, failed, delayed }
  }

  async getSubscriberCount(eventType: string) {
    return this.redisBus.getSubscriberCount(eventType);
  }
}
