# Observability – Developer Guide

**Observability** is a centralized monitoring and audit framework designed for Node.js/TypeScript services. It provides **immutable audit logging, metrics collection, Prometheus integration, and structured event emitters**.

This guide explains how to **integrate, configure, and use** Observability across your application.

## Table of Contents

1. [Installation](#installation)
2. [Initialization](#initialization)
3. [Emitters](#emitters)
4. [Logging API](#logging-api)
   - [Audit Events](#audit-events)
   - [Business Events](#business-events)
   - [HTTP Requests](#http-requests)
   - [System Events](#system-events)

5. [Metrics & Prometheus](#metrics--prometheus)
6. [Advanced Features](#advanced-features)
7. [Examples](#examples)

## Installation

```bash
# Install dependencies (assuming npm)
npm install kafkajs pg prom-client
```

> Observability relies on `PostgreSQL` for audit persistence, `Kafka` for streaming, and `prom-client` for Prometheus metrics.

## Initialization

Observability exposes a **single centralized instance**:

```ts
import { observability, prometheusRegistry } from "#package/monitoring";

// observability is the main interface for logging and metrics
// prometheusRegistry can be used to register custom Prometheus metrics
```

The instance is pre-configured with:

- **AuditChain**: Ensures all audit events are cryptographically linked.
- **PostgresAuditStore**: Persists audit events in PostgreSQL.
- **PrometheusExporter**: Exposes metrics on `/metrics` endpoint.
- **Optional MetricsCollector**: Collects in-memory metrics for HTTP and business events.

## Emitters

Observability supports multiple emitters. Each emitter implements the `BaseEmitter` interface:

| Emitter                | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `PostgresAuditEmitter` | Immutable audit events stored in PostgreSQL        |
| `ConsoleEmitter`       | Logs events to console (useful for dev/debug)      |
| `KafkaEmitter`         | Sends events to Kafka topics (streaming/analytics) |
| `HttpEmitter`          | Sends events to remote HTTP endpoint               |

## Logging API

Observability provides **structured logging** for four main categories:

### 1. Audit Events

Immutable, cryptographically-linked events for security/compliance.

```ts
observability.logAuditEvent({
  ctx: {
    actor: { userId: "123", tenantId: "abc", userRole: "admin" },
    requestId: "req-1",
    traceId: "trace-xyz",
  },
  action: { name: "USER_DELETE", type: "AUTH" },
  resource: { userId: "456", resourceTable: "users" },
  outcome: { success: true },
  metadata: { reason: "User requested deletion" },
});
```

- **Always logged** (bypasses sampling).
- Persisted to Postgres via `PostgresAuditEmitter`.
- Chained with `AuditChain` for tamper-evidence.

### 2. Business Events

Domain-level events, used for metrics and analytics.

```ts
observability.logBusinessEvent({
  ctx: { actor: { userId: "123", tenantId: "abc" } },
  name: "ORDER_PLACED",
  metadata: { orderId: "order-789", totalAmount: 99.99 },
  outcome: { success: true },
});
```

- Can be sampled (controlled by `sampleRate`).
- Prometheus metrics for success/failure are automatically recorded.

### 3. HTTP Requests

Track request performance and status.

```ts
import { FastifyRequest, FastifyReply } from "fastify";

function onRequestComplete(
  req: FastifyRequest,
  res: FastifyReply,
  durationMs: number,
  error?: Error,
) {
  observability.logRequest({ req, res, durationMs, error });
}
```

- Logs request endpoint, status, latency, and errors.
- Automatically integrates with `MetricsCollector` and Prometheus.

### 4. System Events

Track warnings, errors, and alerts in the system.

```ts
observability.logSystemEvent({
  name: "CACHE_MISS",
  metadata: { key: "user_123" },
  severity: "WARN",
});
```

- Prometheus metrics are recorded per severity (`INFO`, `WARN`, `ERROR`).

## Metrics & Prometheus

Observability includes **Prometheus integration**:

```ts
import express from "express"; // optional if you want a separate endpoint

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", prometheusRegistry.contentType);
  res.end(await prometheusRegistry.metrics());
});
```

- Exposes default Node.js metrics (`process_cpu`, `heap_used`, etc.).
- Tracks HTTP, business, system, and security events.
- Optional in-memory `MetricsCollector` can snapshot aggregated metrics:

```ts
const snapshot = observability.metrics?.snapshot();
console.log(snapshot);
observability.metrics?.reset();
```

## Advanced Features

### 1. Sensitive Data Masking

Observability automatically masks sensitive fields (`password`, `token`, `secret`) in logs:

```ts
observability.logBusinessEvent({
  name: "USER_LOGIN",
  metadata: { username: "alice", password: "supersecret" },
});

// "password" field will be masked automatically
```

- Custom fields can be masked via `maskFields` on initialization.

### 2. Event Sampling

- Non-audit events can be sampled to reduce log volume:

```ts
const observability = new Observability({
  serviceName: "orders-service",
  environment: "prod",
  emitters: [auditEmitter],
  sampleRate: 0.2, // Only 20% of non-audit events are logged
});
```

- Audit events are always logged (bypasses sampling).

### 3. Non-blocking Emission

All events are **emitted asynchronously** using `setImmediate`:

```ts
observability.logAuditEvent({ ... }); // Does not block request handling
```

- Failures in any emitter do **not crash the application**.
- Errors are logged internally via `logger.error`.

## Examples

### Complete HTTP Request Logging (Fastify)

```ts
fastify.addHook("onResponse", async (req, res) => {
  const durationMs = Date.now() - (req as any).startTime;
  observability.logRequest({ req, res, durationMs });
});
```

### Logging a Business Event

```ts
observability.logBusinessEvent({
  ctx: { actor: { tenantId: "tenant1", userId: "42" } },
  name: "ITEM_PURCHASED",
  metadata: { itemId: "sku-123", quantity: 3 },
  outcome: { success: true },
});
```

### Logging an Audit Event

```ts
observability.logAuditEvent({
  ctx: { actor: { userId: "42" } },
  action: { name: "UPDATE_ORDER_STATUS", type: "AUTH" },
  resource: { orderId: "order-789" },
  outcome: { success: true },
});
```

### Logging a System Event

```ts
observability.logSystemEvent({
  name: "DATABASE_TIMEOUT",
  metadata: { query: "SELECT * FROM users" },
  severity: "ERROR",
});
```

### Snapshotting Metrics

```ts
const metricsSnapshot = observability.metrics?.snapshot();
console.log(metricsSnapshot);
observability.metrics?.reset();
```

### Custom Prometheus Metric

```ts
import { Gauge } from "prom-client";

const customGauge = new Gauge({
  name: "custom_orders_gauge",
  help: "Number of active orders",
  registers: [prometheusRegistry],
});

customGauge.set(42);
```

## Summary

Observability provides:

1. **Immutable audit logs** (PostgreSQL + AuditChain)
2. **Business and system metrics** with optional **Prometheus export**
3. **Flexible emitters**: Console, Kafka, HTTP, or custom
4. **Sensitive data masking** and **event sampling**
5. **Non-blocking asynchronous emission**

It’s fully compatible with **Fastify** and designed to **scale across microservices**.

This documentation can be shipped alongside your `Observability` module for developers as a **“getting started” guide**.
