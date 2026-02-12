# Response Contract

## Purpose

This document defines the **standard API response structure** that **every endpoint must follow**.

The goal is:

- predictable client behavior
- consistent error handling
- traceability across distributed systems
- zero custom response shapes

There is **one response contract**. No exceptions.

## Core Rule

> **Controllers must never construct responses manually.**

All responses must go through the `RESPONSE` utility.

## Standard Response Shape

Every response must follow this structure:

```json
{
  "status": "success | error | info | redirect",
  "code": 200,
  "message": "Human-readable message",
  "uniqueCode": "SECU-IN-00014",
  "data": {},
  "meta": {
    "requestId": "uuid",
    "auditId": "uuid (optional)"
  }
}
```

## Field Definitions

### `status`

Defines the semantic outcome.

Allowed values:

- `success`
- `error`
- `info`
- `redirect`

Rules:

- Not tied to HTTP code
- Always required

### `code`

HTTP status code.

Rules:

- Must be valid HTTP status
- Must align with outcome
- Not optional

### `message`

Human-readable message.

Rules:

- Must come from translations
- Must not expose internals
- Must not be empty

### `uniqueCode`

System-wide unique response identifier.

Format:

```
SECU-{IN|ER}-{CODE}
```

Rules:

- Generated via RESPONSE utility
- Must be traceable in logs
- Never hard-coded in controllers

### `data`

Response payload.

Rules:

- Optional
- Must be serializable
- Must not include sensitive data

If no data exists, omit the field.

### `meta`

System metadata.

Required:

- `requestId`

Optional:

- `auditId`

Controllers must not mutate meta.

## Success Responses

Example:

```json
{
  "status": "success",
  "code": 201,
  "message": "User created",
  "uniqueCode": "SECU-IN-00018",
  "meta": {
    "requestId": "..."
  }
}
```

## Error Responses

Error responses must:

- Use `status: error`
- Return correct HTTP code
- Include unique error code

Example:

```json
{
  "status": "error",
  "code": 409,
  "message": "User already exists",
  "uniqueCode": "SECU-ER-00010",
  "meta": {
    "requestId": "..."
  }
}
```

## Redirect Responses

Redirects must:

- Use `status: redirect`
- Include `redirectUrl`
- Use HTTP 3xx codes

Handled exclusively via RESPONSE utility.

## Error Handling Rules

### Allowed

- Structured domain errors from services
- Centralized error middleware
- Known error codes

### Forbidden

- Throwing raw errors from controllers
- Returning stack traces
- Sending raw DB or framework errors

## Controller Responsibilities

Controllers must:

1. Validate input
2. Call services
3. Forward service result to RESPONSE

Controllers must not:

- Change response shape
- Wrap responses
- Override codes

## Service Responsibilities (Related)

Services must:

- Return structured response objects
- Never send responses directly

## Global Error Handler

The global error handler must:

- Convert uncaught errors into standard responses
- Attach request metadata
- Mask sensitive details

No other layer handles fatal errors.

## Client Expectations

Clients can safely assume:

- Response shape is stable
- Errors are machine-detectable
- Codes are traceable
- Localization is consistent

## Anti-Patterns (Strictly Forbidden)

- `res.json({...})` in controllers
- Custom error formats
- Multiple response shapes
- Conditional response structures

## Review Checklist

Before approval, verify:

- RESPONSE utility is used
- HTTP codes match semantics
- No raw responses exist
- Unique codes are traceable

## Summary

The response contract is the **public API promise**.

Breaking it:

- breaks clients
- breaks observability
- breaks trust
