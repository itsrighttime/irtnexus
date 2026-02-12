# Controller Guidelines

## Purpose

This document defines **exact responsibilities, boundaries, and constraints** for controllers.

Controllers act as the **orchestration layer** between:

- HTTP layer (routes)
- Validation layer
- Service (business logic) layer

Controllers must remain **thin, predictable, and enforceable**.

## What a Controller Is (In This System)

A controller is responsible for:

```
Request → Validation → Service → Response
```

Nothing more.

A controller **does not**:

- Contain business logic
- Perform data access
- Handle cross-cutting concerns

## Mandatory Controller Responsibilities

Every controller **must** perform the following steps, in order:

1. Read request input
2. Invoke the validator
3. Call the service layer
4. Return standardized response

Skipping or reordering steps is prohibited.

## Controller Folder Structure

Controllers must be organized by domain context:

```
controllers/
├── user/
│   ├── createUser.controller.js
│   ├── updateUser.controller.js
│   └── getUser.controller.js
├── auth/
│   └── login.controller.js
```

### Rules

- One file per controller
- File name must reflect the action
- No shared controllers across domains

## Validation Rules

### Mandatory Validation

- All incoming client data must be validated
- Validation must happen at the **top** of the controller
- Validation logic must live in the validator layer

Controllers must never manually validate fields.

### GET Request Exception

- GET requests with **no client input** may skip validation
- If query params exist, validation is required

## Validator Invocation Pattern

Controllers must:

- Call exactly one validator
- Fail fast on validation errors
- Never modify validated data

Validators must return sanitized, trusted input.

## Service Invocation Rules

Controllers must:

- Call services explicitly
- Pass request context to services
- Never contain business rules

Controllers must not:

- Call queries
- Call multiple unrelated services
- Orchestrate complex workflows

If orchestration becomes complex, move it into a service.

## Request Context Usage

Controllers may **read** from request context:

- requestId
- traceId
- actor
- language

Controllers must **not**:

- Modify request context
- Create new context fields

## Response Handling Rules

Controllers are responsible for:

- Sending HTTP responses
- Mapping service output to response format
- Using standardized response wrappers

Controllers must not:

- Format domain data
- Localize messages manually
- Handle transport-level errors

## Error Handling Rules

### Allowed

- Let errors bubble to global error handler
- Throw domain-neutral errors

### Forbidden

- try/catch blocks inside controllers
- Swallow errors
- Custom error responses

All error formatting is centralized.

## Statelessness Requirement

Controllers must be:

- Stateless
- Idempotent (where applicable)
- Safe for concurrent execution

Forbidden:

- In-memory state
- Caching
- Global variables

## Controller Length & Complexity Limits

Recommended limits:

- Max ~50 lines per controller
- Single service call per controller
- No conditional branching based on business rules

If limits are exceeded, refactor.

## Testing Expectations

Controllers must have:

- Unit tests for happy paths
- Tests for validation failures
- Tests for service error propagation

Controllers must not be tested for business logic.

## Common Anti-Patterns

Strictly forbidden:

- Business logic in controllers
- Database calls
- Conditional flows based on domain rules
- Response localization
- Multiple validators per controller

## Review Checklist (Controllers)

During review, verify:

- Validator is called first
- No business logic present
- Exactly one service is invoked
- No database access
- No error handling logic

## Summary

Controllers are **traffic coordinators**, not decision makers.

They must:

- Validate
- Delegate
- Respond

Nothing else.
