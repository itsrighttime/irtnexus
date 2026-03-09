# Error Handling Guidelines

## Purpose

This document defines a **single, disciplined error-handling strategy**.

The goals are:

- predictable failure behavior
- zero information leakage
- strong observability
- clear separation between domain errors and system faults

Errors are **part of the design**, not an afterthought.

## Error Classification

All errors fall into one of the following categories:

1. **Domain Errors** (Expected)
2. **System Errors** (Unexpected)
3. **Infrastructure Errors** (External dependencies)

Each category is handled differently.

## 1. Domain Errors

### Definition

Domain errors represent **valid business outcomes**.

Examples:

- user already exists
- invalid OTP
- reservation expired
- quota exceeded

These are not crashes.

### Where Domain Errors Are Created

Domain errors:

- **Must be created in services**
- **Must be returned, not thrown**

Controllers forward them unchanged.

### Domain Error Structure

Domain errors must be created using:

```js
RESPONSE.struct(
  RESPONSE.status.ERROR,
  HTTP_STATUS.x4_CONFLICT,
  translate("user.already_exists"),
  "00010",
  optionalData,
);
```

Rules:

- HTTP 4xx
- Stable unique code
- Localized message
- Optional diagnostic data

### Forbidden for Domain Errors

- `throw new Error()`
- Logging stack traces
- Returning raw DB errors

## 2. System Errors

### Definition

System errors represent **bugs or invariant violations**.

Examples:

- null dereference
- unexpected state
- missing configuration
- corrupted data

These indicate developer or system failure.

### Where System Errors Occur

- Services
- Queries
- Infrastructure adapters

They propagate upward.

### Handling System Errors

System errors:

- **Must be thrown**
- **Must be caught by the global error handler**
- **Must be masked from clients**

### Client Response for System Errors

Clients receive:

```json
{
  "status": "error",
  "code": 500,
  "message": "Internal server error",
  "uniqueCode": "SECU-ER-XXXXX",
  "meta": {
    "requestId": "..."
  }
}
```

No internals are exposed.

## 3. Infrastructure Errors

### Definition

Infrastructure errors come from external systems.

Examples:

- database down
- Redis unavailable
- email provider timeout

### Handling Strategy

Infrastructure errors:

- Are treated as system errors
- Are logged with context
- May trigger circuit breakers or alerts

Clients receive masked responses.

## Global Error Handler Responsibilities

The global error handler must:

- Catch all uncaught errors
- Log full error details
- Map to standard response contract
- Attach request metadata

No other layer may perform this role.

## Logging Rules

### What to Log

- Error stack trace
- requestId
- traceId
- action name
- resource identifier

### What NOT to Log

- Passwords
- OTPs
- Tokens
- PII unless redacted

## Error Codes

### Rules

- Error codes must be stable
- Error codes must be documented
- Error codes must be searchable in logs

Format:

```
SECU-ER-XXXXX
```

## Controller Rules

Controllers must:

- Never catch domain errors
- Catch only unexpected exceptions
- Delegate error formatting to RESPONSE

Controllers must not:

- Log errors
- Transform error messages
- Generate new error codes

## Query Layer Rules

Queries must:

- Never catch errors unless required
- Never translate errors
- Let DB errors bubble up

## Retry & Idempotency

Retries:

- Must not be automatic unless defined
- Must respect idempotency guarantees

Do not retry blindly.

## Observability Integration

Every error must be observable via:

- logs
- metrics
- traces

Errors without visibility are treated as bugs.

## Anti-Patterns (Strictly Forbidden)

- Swallowing errors
- Logging without rethrowing
- Returning raw errors
- Multiple error formats

## Review Checklist

During review, verify:

- Domain errors are returned
- System errors are thrown
- Global handler exists
- No layer leaks internals

## Summary

Errors are **signals**, not noise.

Handle them:

- deliberately
- consistently
- safely
