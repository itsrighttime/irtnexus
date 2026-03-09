## 1 **requestId**

- **Scope:** Single service / single request lifecycle
- **Purpose:** Identify the request **within one service**.
- **Generated:** Usually when the request hits your service (middleware).
  Example: `req.context.requestId = crypto.randomUUID()`
- **Usage:** Logging, audit correlation, performance measurement **within this service only**.
- **Characteristics:**
  - Unique per request
  - Does **not need to propagate** across services

Think: “this is my local request fingerprint.”

## 2 **traceId**

- **Scope:** Distributed across multiple services (microservices / external calls)
- **Purpose:** Track the **full journey of a request** across services.
- **Generated:**
  - Often comes from **upstream service** or **generated at entry point** if this is the first service.
  - Propagated in HTTP headers, e.g., `traceparent` (W3C standard) or `X-Trace-Id`.

- **Usage:**
  - Distributed tracing
  - Correlate logs across services
  - Build a **timeline** in tracing systems (Jaeger, Zipkin, Datadog APM)

- **Characteristics:**
  - Same for **all microservices handling this request**
  - Helps see where a request spent time, where it failed, etc.

Think: “this is the global journey ID.”

### 3 **How they work together**

| Field     | Scope         | Unique per request?           | Propagates across services? | Purpose                           |
| --------- | ------------- | ----------------------------- | --------------------------- | --------------------------------- |
| requestId | local service | ✅ yes                        | ❌ no                       | Logs, audit, internal correlation |
| traceId   | distributed   | ✅ yes (per request)          | ✅ yes                      | End-to-end distributed tracing    |
| auditId   | local action  | ✅ yes (per auditable action) | ❌ usually                  | Immutable audit record reference  |

### 4 Example flow (multi-service)

```
Client → Service A → Service B → Service C
```

- Service A receives HTTP request
  - generates `requestId = RQ-A-123`
  - generates `traceId = TR-XYZ-999`
  - sets `auditId` for each sensitive action

- Service A calls Service B
  - passes `traceId = TR-XYZ-999` in headers
  - Service B generates its own `requestId = RQ-B-456`
  - logs still reference same `traceId`

- Service B calls Service C
  - passes `traceId = TR-XYZ-999` again
  - Service C generates `requestId = RQ-C-789`

All logs can be traced **by traceId**, all logs **within a service** can be correlated **by requestId**.

### TL;DR

- **requestId** → local, per-service, per-request
- **traceId** → global, per-request, across all services
- **auditId** → local, per-action, immutable for audit records

So yes, **requestId and traceId are both unique per request**, but **traceId is global**, **requestId is local**, and **auditId is per action**.
