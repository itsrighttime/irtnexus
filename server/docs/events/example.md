# **1️⃣ User Service API**

A simple **REST API** that creates a user and emits events.

```ts
import express from "express";
import { EventBus } from "./event-bus";

const app = express();
app.use(express.json());

const eventBus = new EventBus(process.env.REDIS_URL!);

// Subscribe to notifications (optional)
eventBus.subscribe("UserCreated", async (event) => {
  console.log(`[User Service] New user:`, event.payload.name);
});

// Endpoint: Create user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  // Normally save to DB here
  const userId = Math.floor(Math.random() * 10000);

  // Publish event
  await eventBus.publish({
    eventType: "UserCreated",
    tenantId: "tenant_123",
    payload: { userId, name, email },
    sourceModule: "user-service",
    version: "1.0.0",
  });

  res.status(201).json({ userId, name, email });
});

app.listen(3000, () => console.log("User service running on port 3000"));
```

✅ **What happens:**

- `POST /users` creates a user and emits a `UserCreated` event.
- Any other microservice subscribed to `UserCreated` will receive it in real-time.
- Heavy async tasks can be handled by the worker automatically.

# **2️⃣ Notification Service API**

A service that **sends notifications** whenever a user is created.

```ts
import express from "express";
import { EventBus } from "./event-bus";

const app = express();
app.use(express.json());

const eventBus = new EventBus(process.env.REDIS_URL!);

// Subscribe to UserCreated events
eventBus.subscribe("UserCreated", async (event) => {
  console.log(
    `[Notification Service] Sending welcome email to:`,
    event.payload.email,
  );

  // Simulate async notification logic
  await eventBus.publish({
    eventType: "NotificationCreated",
    tenantId: event.tenantId,
    payload: {
      message: `Welcome ${event.payload.name}!`,
      email: event.payload.email,
    },
    sourceModule: "notification-service",
    version: "1.0.0",
  });
});

app.listen(3001, () =>
  console.log("Notification service running on port 3001"),
);
```

✅ **What happens:**

- Whenever `UserCreated` is published, this service subscribes and triggers a `NotificationCreated` event.
- Can be processed asynchronously by your workers or other services.

# **3️⃣ Reporting Service – Request/Reply Example**

Suppose another service needs a **report generation request** and waits for a response.

```ts
import express from "express";
import { EventBus } from "./event-bus";

const app = express();
app.use(express.json());

const eventBus = new EventBus(process.env.REDIS_URL!);

// Endpoint to request a report
app.post("/reports", async (req, res) => {
  const { reportId } = req.body;

  try {
    const result = await eventBus.request<{ status: string }>(
      "GenerateReport",
      { reportId },
      10000, // timeout 10s
    );

    res.json({ reportId, status: result.status });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate report" });
  }
});

app.listen(3002, () => console.log("Reporting service running on port 3002"));
```

### **Worker that responds to report requests**

```ts
eventBus.subscribe("GenerateReport", async (event) => {
  console.log(`[Reporting Worker] Generating report ${event.payload.reportId}`);

  // Simulate report generation
  await new Promise((r) => setTimeout(r, 2000));

  // Respond on the reply channel
  await eventBus.publish({
    eventType: event.payload.replyChannel,
    tenantId: event.tenantId,
    payload: { status: "completed" },
    sourceModule: "reporting-service",
    version: "1.0.0",
  });
});
```

✅ **What happens:**

- Client POSTs `/reports` → `request()` sends a `GenerateReport` event with a temporary reply channel.
- Worker handles event → publishes result to reply channel → `request()` resolves promise.

# **4️⃣ Delayed / Scheduled Jobs Example**

For example, sending a **reminder email** 24 hours later:

```ts
await eventBus.publishDelayed(
  {
    eventType: "NotificationCreated",
    tenantId: "tenant_123",
    payload: {
      message: "Don't forget to verify your email!",
      email: "alice@example.com",
    },
    sourceModule: "notification-service",
    version: "1.0.0",
  },
  24 * 60 * 60 * 1000, // 24 hours
);
```

- Uses BullMQ delayed jobs.
- Ensures reliable delivery even if the subscriber is offline.

# **Key Takeaways / Best Practices**

1. **All event handlers must be `async`**.
2. **Provide `sourceModule` and `version`** for observability.
3. Use **delayed events** for scheduled tasks and retries.
4. Use **request/reply** for RPC-style interactions.
5. Monitor your queue with `getQueueStats()` and `getSubscriberCount()` for health checks.

This setup allows you to build **microservice APIs that are decoupled**: services emit events without knowing who consumes them, and subscribers or workers process asynchronously or in real-time.
