# Kafka Usage Guideline (Monolithic Modular Services)

## 1️⃣ Architectural Context

- **Single monolithic server**, but logically divided into **service folders**:
  - e.g., `/services/auth`, `/services/notifications`, `/services/registration`

- Each service is **self-contained** but can communicate via **Kafka** asynchronously.
- Goal: Even in monolithic setup, use Kafka **as if services are separate**.
  - This makes future **microservice split** easy without changing event contracts.

## 2️⃣ Kafka Principles

1. **Single Kafka client instance per application**
   - Centralized producer and consumer access.
   - Managed via `KafkaService` (see implementation above).
   - Avoid multiple producer connections per service.

2. **Topic Namespacing**
   - Format: `${ENV}.${SERVICE}.${EVENT_NAME}`
   - Examples:

     ```text
     dev.auth.user_registered
     dev.notifications.email_queued
     prod.auth.user_logged_in
     ```

   - Helps **prevent collisions** and supports multi-env deployments.

3. **Producer Responsibilities**
   - Only **publish events**, never consume your own events.
   - Event payloads should be **JSON-serializable**.
   - Include **contextual metadata**:
     - `requestId` / `traceId`
     - `tenantId` / `userId`
     - `timestamp`

   - Always integrate with **Observability & Prometheus**:
     - Track success/failure for each send.

4. **Consumer Responsibilities**
   - Each service can have **one or more consumers** subscribing to relevant topics.
   - Always handle errors:
     - Retry logic
     - Optional **Dead Letter Queue (DLQ)** for failed messages.

   - Keep processing **idempotent**:
     - Messages might be delivered more than once.

   - Consumers should integrate with **Observability**:
     - Log system events on failure.
     - Track message throughput / processing time.

## 3️⃣ Directory Structure (Example)

```
/services
  /auth
    auth.controller.js
    auth.kafka.js   <-- publishes auth events
  /notifications
    notifications.controller.js
    notifications.kafka.js <-- consumes & publishes notification events
  /registration
    registration.controller.js
    registration.kafka.js
/core
  KafkaService.js  <-- central Kafka client
  observability.js
```

- Each service should **import the centralized KafkaService** from `/core`.
- Services **do not instantiate their own Kafka clients**.

## 4️⃣ Event Contracts

- Each topic must have a **clearly defined contract** (payload schema):

  ```json
  {
    "userId": "string",
    "tenantId": "string",
    "event": "user_registered",
    "timestamp": "ISO8601",
    "metadata": {}
  }
  ```

- Optional: Use JSON Schema or TypeScript interfaces to **enforce consistency**.

- **Version your events**:
  - Include `eventVersion` in payload.
  - Allows backward-compatible changes when the monolith eventually splits.

## 5️⃣ Observability & Metrics

- Every Kafka interaction should report to:
  - **Prometheus metrics**: `kafka_send`, `kafka_consume`
  - **Structured logging** via `Observability`
    - Log errors, retries, DLQ pushes

- Example:

  ```js
  observability.logSystemEvent({
    name: "kafka_send_failed",
    metadata: { topic, error: err.message },
    severity: "ERROR",
  });
  ```

## 6️⃣ Guidelines for Publishing Events

1. Import the centralized Kafka service:

   ```js
   import { kafkaService } from "#core";
   ```

2. Send events using `send()`:

   ```js
   await kafkaService.send("auth.user_registered", {
     userId: user.id,
     tenantId: user.tenantId,
     event: "user_registered",
     timestamp: new Date().toISOString(),
     metadata: { plan: user.plan },
   });
   ```

3. Track success/failure automatically via **Observability & Prometheus**.

## 7️⃣ Guidelines for Consuming Events

1. Define a consumer in the service:

   ```js
   await kafkaService.consume(
     "notifications.email_queued",
     "notifications-group",
     async (payload) => {
       // Process event
       sendEmail(payload.email, payload.template);
     },
   );
   ```

2. Handle errors:
   - Retry a few times
   - Log failures
   - Optionally push to DLQ

3. Keep consumer **idempotent**:
   - Use `payload.eventId` or `requestId` to avoid double-processing.

## 8️⃣ Future-Proofing

- When splitting into microservices:
  - Each service can **reuse the same topics**.
  - Consumer/producer logic remains unchanged.

- Maintain **topic contracts** in a central schema registry (future improvement).
- Optional: Add **Kafka Connect / Schema Registry** for enterprise-grade validation.

## ✅ Best Practices Summary

- Centralized `KafkaService` per monolith.
- Namespaced topics: `${ENV}.${SERVICE}.${EVENT}`.
- Always include `requestId`, `traceId`, and `timestamp` in payloads.
- Observability + Prometheus metrics for every send/consume.
- Idempotent consumers and DLQ support.
- Versioned events for backward compatibility.
- Modular service folders can become standalone services in the future with minimal change.
