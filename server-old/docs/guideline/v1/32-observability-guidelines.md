# Observability Guidelines

## Purpose

This document defines **logging, metrics, tracing, and auditing standards**.

If a system cannot be observed, it **cannot be trusted**.

Observability is a **first-class system feature**, not a debugging aid.

## Core Observability Pillars

The system observes:

1. **Logs** – what happened
2. **Metrics** – how often and how long
3. **Traces** – where time was spent
4. **Audits** – who did what and why

All four are mandatory.

## Request Lifecycle Visibility

Every request must produce:

- requestId
- traceId
- start timestamp
- duration
- outcome

This is initialized in `requestContextMiddleware`.

No request is allowed to bypass this.

## Logging Guidelines

### Purpose of Logs

Logs are for:

- engineers
- incident response
- forensic analysis

Logs are **not** for:

- clients
- business logic
- user-facing messaging

### Log Levels

Allowed levels:

- `error` – system failure
- `warn` – recoverable anomaly
- `info` – business milestones
- `verbose` / `debug` – diagnostics

Rules:

- Default level: `info`
- Never log at `error` for domain failures

### What Must Be Logged

Every log entry must include:

- requestId
- traceId
- service or action name

When applicable:

- resource id
- actor
- error stack (system errors only)

### What Must NOT Be Logged

Never log:

- passwords
- OTPs
- tokens
- secrets
- raw PII

Redaction is mandatory.

## Metrics Guidelines

### Required Metrics

At minimum:

- request count
- request duration
- error count (by category)
- status code distribution

Metrics must be:

- labeled
- low cardinality
- stable

### Prometheus Usage

- Metrics start in request middleware
- Metrics end on response finish
- Services may emit domain counters

Avoid:

- dynamic label values
- per-user labels

## Tracing Guidelines

### Trace Context

Tracing must propagate:

- traceId
- requestId

Across:

- services
- async boundaries
- external calls (if supported)

### Span Ownership

- Middleware: root span
- Service actions: child spans
- External calls: dedicated spans

Do not create spans in controllers.

## Audit Logging

### What Is Audited

Audit logs capture:

- actor
- action name
- resource
- timestamp
- outcome

Audits are **immutable**.

### Where Audits Are Created

Audits are created:

- inside `executeAction`
- inside services only

Controllers never create audits.

## Failure Visibility

On failure:

- full context is logged
- metrics are incremented
- traces are annotated

Silent failures are unacceptable.

## Correlation Rules

Every system must allow correlation by:

- requestId
- uniqueCode
- auditId (if exists)

Without correlation, logs are invalid.

## Performance Observability

Track:

- slow endpoints
- slow queries
- external latency

Performance regressions must be detectable.

## Testing Observability

Tests must assert:

- logs exist for key actions
- metrics counters increment
- traces propagate context

Observability without tests will degrade.

## Anti-Patterns (Strictly Forbidden)

- Logging without context
- Console logs
- Logging in controllers
- Logging secrets
- Metrics with unbounded labels

## Review Checklist

Verify:

- request context exists
- logs are structured
- metrics are bounded
- audits are consistent

## Summary

Observability answers:

- What happened?
- To whom?
- When?
- Why?

If you cannot answer these, the system is incomplete.
