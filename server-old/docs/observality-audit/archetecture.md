# Observability & Audit Architecture

**Design Document**

## 1. Purpose

This document defines how our system records, correlates, and exposes information about system behavior, business actions, and security-relevant events.

The goals are:

- Provide **clear operational visibility** for engineers
- Maintain **immutable, legally defensible audit trails**
- Enable **end-to-end tracing** across services
- Ensure **every client response is traceable**
- Avoid duplication, noise, and ambiguity

This architecture intentionally separates **logs**, **audit events**, and **metrics**, while tightly correlating them through shared identifiers.

## 2. Core Principles

1. **Single action → multiple representations**
   - One user or system action can produce:
     - a client response
     - operational logs
     - audit records
     - metrics

   - Each representation serves a different audience and purpose.

2. **Separation of concerns**
   - Operational logs are not audits
   - Audits are not analytics
   - Metrics are not logs

3. **Correlation over combination**
   - Systems are linked via shared IDs
   - Data streams remain independent and purpose-built

4. **Audit logs are immutable**
   - Never sampled
   - Never overwritten
   - Never emitted through non-audit channels

5. **Context is created once**
   - Context is generated at request entry
   - Context flows through all layers
   - No ad-hoc ID creation in business logic

## 3. High-Level Architecture

At runtime, every request flows through the following conceptual pipeline:

```
HTTP Request
   ↓
Context Initialization
   ↓
Business Action Execution
   ↓
├─ Client Response
├─ Winston Logs
├─ Audit Logs (DB)
└─ Metrics (Prometheus)
```

### Final architecture picture

```
           ┌────────────┐
           │ HTTP Req   │
           └─────┬──────┘
                 │
        ┌────────▼────────┐
        │ Context Middleware│
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ executeAction() │
        └────┬─────┬─────┘
             │     │
     ┌───────▼─┐ ┌─▼─────────┐
     │ Winston │ │ Audit DB  │
     └─────────┘ └───────────┘
             │
        ┌────▼────┐
        │ Response │
        └──────────┘
```

Each output is generated from the **same action context**.

## 4. The Three ID Model

The system uses **three distinct identifiers**, each with a clearly defined responsibility.

### 4.1 requestId — Transport Scope

**Definition:**
Identifies a single HTTP request–response cycle.

**Characteristics:**

- Generated at request entry
- Always present
- Short-lived
- Exposed to clients

**Used by:**

- Client responses
- Winston logs
- Error tracking
- Support workflows

**Question it answers:**

> “Which API request caused this?”

### 4.2 auditId — Compliance Scope

**Definition:**
Identifies a single auditable business or security action.

**Characteristics:**

- Generated when an auditable action starts
- Immutable
- May outlive the original request
- Never reused
- Persisted in the audit database

**Used by:**

- Audit logs
- Compliance & legal review
- Security investigations

**Important properties:**

- One request can generate multiple auditIds
- One auditId can span multiple requests

**Question it answers:**

> “Which action was performed, by whom, on what resource?”

### 4.3 traceId — Distributed Scope

**Definition:**
Identifies a logical execution flow across services, workers, and async boundaries.

**Characteristics:**

- Propagated via headers or message metadata
- May span multiple services
- Compatible with distributed tracing systems

**Used by:**

- Performance analysis
- Latency debugging
- Cross-service correlation

**Question it answers:**

> “How did this execution flow through the system?”

## 5. Action Context

### 5.1 Definition

An **Action Context** is the shared, in-memory object that carries all correlation data for the duration of an action.

It is created once and reused everywhere.

### 5.2 Mandatory Fields

- requestId
- traceId
- auditId (if action is auditable)
- actor (user or system identity)
- action (name + type)
- resource (type + identifier)
- startTime

### 5.3 Lifecycle

1. Created in request middleware
2. Enriched during authentication
3. Passed into business logic
4. Used by:
   - response formatter
   - logger
   - audit emitter

5. Destroyed at request completion

## 6. Client Response Design

Every client response includes correlation metadata.

### Response Metadata

- requestId — for support & debugging
- auditId — when an auditable action occurred

### Purpose

- Enables users and support teams to reference specific actions
- Allows external systems to report precise issues
- Creates trust and transparency

## 7. Winston (Operational) Logging

### Purpose

Winston logs exist to help engineers:

- Debug issues
- Understand runtime behavior
- Diagnose failures

### Characteristics

- High volume
- Structured
- May be sampled or rotated
- Environment-dependent verbosity

### Required Context Fields

Every log entry must include (when available):

- requestId
- traceId
- action name
- actor (non-sensitive)
- resource identifier

### What Winston Logs Must NOT Be

- A source of truth for compliance
- A replacement for audit logs
- An immutable record

## 8. Audit Logging

### Purpose

Audit logs provide a **tamper-evident, legally defensible record** of critical actions.

### Characteristics

- Stored in a database
- Hash-chained
- Immutable
- Masked for sensitive fields
- Never sampled

### What Gets Audited

- Authentication events
- Authorization decisions
- Identity changes
- Security-relevant operations
- Business actions with legal or financial impact

### Required Audit Fields

- auditId
- timestamp
- actor
- action
- resource
- outcome (success / failure)
- requestId
- traceId
- hash + previousHash

## 9. Metrics (Prometheus)

### Purpose

Metrics answer questions like:

- How often does this happen?
- How long does it take?
- Is it getting worse?

### Characteristics

- Aggregated
- No PII
- No identifiers like auditId
- Used for alerting and dashboards

Metrics complement logs and audits but never replace them.

## 10. Event Synchronization Guarantee

For any auditable action, the system guarantees:

1. **Exactly one audit event** is emitted
2. **At least one operational log** is recorded
3. **A correlated response** is sent to the client
4. All share:
   - requestId
   - traceId
   - auditId (where applicable)

This ensures complete traceability from user → system → storage.

## 11. Failure Handling

### If Winston Logging Fails

- Business flow continues
- Error is swallowed or reported internally

### If Audit Logging Fails

- Action may be aborted (policy-dependent)
- Failure is treated as a system error
- No silent audit loss

### If Metrics Fail

- No impact on business logic

## 12. Security & Privacy

- Sensitive fields are masked before emission
- Logs avoid secrets by convention
- Audit logs are access-controlled
- Client responses never expose internal details

## 13. Summary

This architecture ensures:

- Strong separation of concerns
- Complete observability
- Legal and security compliance
- Future-proof scalability
- Minimal developer cognitive load

By correlating — not combining — logs, audits, metrics, and responses, the system remains both **powerful and maintainable**.
