# **EventBus Developer Guide**

The `EventBus` is a **hybrid event system** combining real-time Pub/Sub (via Redis) and reliable asynchronous processing (via BullMQ). It allows microservices to communicate efficiently and safely.

## **1️⃣ Importing the EventBus**

```ts
import { EventBus } from "./event-bus";
import type { BaseEvent } from "./types/event";

// Initialize the EventBus with your Redis URL
const eventBus = new EventBus(process.env.REDIS_URL!);
```

## **2️⃣ Publishing Events**

### **Basic publish**

```ts
await eventBus.publish({
  eventType: "UserCreated",
  tenantId: "tenant_123",
  payload: { name: "Alice", email: "alice@example.com" },
  sourceModule: "user-service",
  version: "1.0.0",
});
```

- Publishes the event **real-time** via Redis.
- Adds it to the **async queue** for heavy processing.
- `eventId` and `timestamp` are automatically added.

### **Delayed / Scheduled Events**

```ts
await eventBus.publishDelayed(
  {
    eventType: "NotificationCreated",
    tenantId: "tenant_123",
    payload: { message: "Reminder: Complete your profile" },
    sourceModule: "notification-service",
    version: "1.0.0",
  },
  5000, // delay in milliseconds
);
```

- Event will be processed **after 5 seconds**.

### **Batch publishing**

```ts
await eventBus.publishBatch([
  {
    eventType: "UserCreated",
    tenantId: "tenant_123",
    payload: { name: "Bob" },
    sourceModule: "user-service",
    version: "1.0.0",
  },
  {
    eventType: "UserCreated",
    tenantId: "tenant_123",
    payload: { name: "Charlie" },
    sourceModule: "user-service",
    version: "1.0.0",
  },
]);
```

- Sends multiple events efficiently in one call.

## **3️⃣ Subscribing to Events**

### **Single event type**

```ts
eventBus.subscribe("UserCreated", async (event) => {
  console.log(`[Subscriber] New user: ${event.payload.name}`);
});
```

### **Multiple event types**

```ts
eventBus.subscribe(["UserCreated", "UserDeleted"], async (event) => {
  console.log(`[Subscriber] Event ${event.eventType} received`);
});
```

### **Unsubscribe**

```ts
const handler = async (event: BaseEvent) => {
  console.log("Handler triggered:", event);
};

// Subscribe
eventBus.subscribe("UserCreated", handler);

// Later, remove specific handler
eventBus.unsubscribe("UserCreated", handler);

// Or remove all handlers for the event type
eventBus.unsubscribe("UserCreated");
```

## **4️⃣ Request/Reply (RPC-style)**

- Useful when you need a **response from another service**.

```ts
const response = await eventBus.request<{ status: string }>(
  "GenerateReport",
  { reportId: "report_001" },
  10000, // optional timeout in ms
);

console.log("Report status:", response.status);
```

> Under the hood, a temporary reply channel is created automatically.

## **5️⃣ Middleware Support**

- Middleware runs **before an event is published** (both real-time and async).

```ts
// Logging middleware
eventBus.use(async (event, next) => {
  console.log(`[Middleware] Publishing event ${event.eventType}`);
  await next();
});

// Validation middleware example
eventBus.use(async (event, next) => {
  if (!event.tenantId) throw new Error("TenantId is required!");
  await next();
});
```

## **6️⃣ Monitoring & Health**

```ts
// Queue stats (pending, active, completed, failed, delayed jobs)
const stats = await eventBus.getQueueStats();
console.log("Queue stats:", stats);

// Number of subscribers for a specific event type
const count = await eventBus.getSubscriberCount("UserCreated");
console.log("Subscribers for UserCreated:", count);
```

## **7️⃣ Full Example Flow**

```ts
// Subscribe
eventBus.subscribe("NotificationCreated", async (event) => {
  console.log("Send notification:", event.payload.message);
});

// Publish an event
await eventBus.publish({
  eventType: "NotificationCreated",
  tenantId: "tenant_123",
  payload: { message: "Welcome to our platform!" },
  sourceModule: "notification-service",
  version: "1.0.0",
});

// Publish delayed event
await eventBus.publishDelayed(
  {
    eventType: "NotificationCreated",
    tenantId: "tenant_123",
    payload: { message: "Don't forget to verify your email!" },
    sourceModule: "notification-service",
    version: "1.0.0",
  },
  10000, // 10 seconds delay
);

// Request/Reply Example
const status = await eventBus.request<{ result: string }>("GenerateReport", {
  reportId: "abc123",
});
console.log("Report generated:", status.result);
```

## **8️⃣ Best Practices**

1. **Always make handlers `async`** → avoids TypeScript errors and ensures promise resolution.
2. **Provide `sourceModule` and `version`** → for observability and debugging.
3. **Use delayed events for retries or scheduled tasks** → don’t block real-time subscribers.
4. **Use middleware for cross-cutting concerns** → logging, validation, metrics.
5. **Monitor queue stats** → prevent job pile-ups and detect failures early.

This guide covers **all public-facing features** of your `EventBus` and shows examples for **every major use case**: real-time events, async processing, delayed jobs, batch publishing, RPC, middleware, and monitoring.
