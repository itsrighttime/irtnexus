# Request Lifecycle

## Purpose

This document defines the **mandatory, end-to-end lifecycle** that **every HTTP request** must follow in this system.

This lifecycle is **deterministic** and **non-negotiable**.
It exists to guarantee:

- Predictable execution
- Observability by default
- Consistent error handling
- Clear ownership at each stage
- Strong security boundaries

Any request that bypasses or alters this lifecycle is considered **architecturally invalid**.

## Lifecycle Categories

The request lifecycle is divided into two categories:

### 1. Framework-Enforced Lifecycle

Stages implemented at the infrastructure level and **cannot be bypassed**.

### 2. Developer-Enforced Lifecycle

Stages that developers must implement by following defined conventions and guidelines.

Both categories are required for a request to be considered compliant.

## High-Level Flow

```
Client
  ↓
Framework Middlewares
  ↓
Routing
  ↓
Controller
  ↓
Validation
  ↓
Service
  ↓
Data Access (Queries)
  ↓
Response Formatting
  ↓
Observability Finalization
  ↓
Client
```

## Stage 1: Request Entry

### Description

The request enters the system via the HTTP server (Express).

### Guarantees

- The server configuration is initialized
- Security headers are applied
- Request parsing is enabled

### Enforcement

- Central server bootstrap file
- No route is mounted outside this file

## Stage 2: Language Resolution (Framework-Enforced)

### Responsibility

Determine the active language for the request.

### Behavior

- Language is resolved from:
  1. Request headers
  2. Query parameters
  3. Default fallback

- Language is stored in request-scoped context

### Guarantees

- Language is available globally during request execution
- No layer needs to manually pass language data

### Forbidden

- Reading language directly from headers outside middleware
- Hardcoded user-facing strings

## Stage 3: Request Context Initialization (Framework-Enforced)

### Responsibility

Attach execution metadata and start observability.

### Context Properties

- requestId
- traceId
- auditId (lazy)
- actor (default: anonymous)
- startTime

### Observability

- Metrics start before business logic
- Metrics end after response is sent

### Guarantees

- Every request is traceable
- Every response contains a requestId

## Stage 4: Routing

### Responsibility

Map URLs to controllers.

### Rules

- Routes are grouped as:
  - Public routes
  - Private routes

- Routes contain **no logic**

### Forbidden

- Validation in routes
- Business logic in routes
- Database access in routes

## Stage 5: Controller Execution (Developer-Enforced)

### Responsibility

Orchestrate request handling.

### Allowed Actions

- Invoke validators
- Call services
- Return standardized responses

### Mandatory Order

1. Validation
2. Service invocation
3. Response sending

### Forbidden

- Business logic
- Database access
- Direct response formatting

Controllers are **coordination layers only**.

## Stage 6: Validation (Developer-Enforced)

### Responsibility

Validate and sanitize all client input.

### Rules

- One validator per API
- Validation happens before any side effects
- Invalid input must not reach services

### Output

- Structured validation result
- Sanitized payload for downstream use

## Stage 7: Service Execution (Developer-Enforced)

### Responsibility

Execute business logic.

### Mandatory Execution Pattern

All services must execute via:

```
executeAction({
  req,
  action,
  resource,
  handler
})
```

### Guarantees

- Action is traceable
- Execution is auditable
- Future authorization is enforceable

### Handler Responsibilities

- Business rules
- Orchestration of queries
- Transaction boundaries
- Integration with external systems

### Forbidden

- Direct response handling
- Express-specific logic
- Inline SQL

## Stage 8: Data Access (Queries)

### Responsibility

Persist and retrieve data.

### Rules

- SQL only
- No business decisions
- Optional transaction support

### Guarantees

- Clear isolation of persistence logic
- Safe transactional execution

## Stage 9: Response Construction

### Responsibility

Return a standardized response to the client.

### Rules

- All responses must use the RESPONSE utility
- Responses must include request metadata
- Error codes must be stable

### Forbidden

- Direct `res.json()` usage
- Ad-hoc response formats

## Stage 10: Observability Finalization (Framework-Enforced)

### Responsibility

Finalize metrics and logs.

### Behavior

- Execution duration is recorded
- Response status is logged
- Errors are captured centrally

### Guarantees

- No request completes without observability
- Failures are visible and traceable

## Failure Handling Across the Lifecycle

### Known Failures

- Returned as structured error responses
- Do not throw unless escalation is required

### Unknown Failures

- Propagated to global error handler
- Logged with full context
- Returned as standardized internal errors

## Lifecycle Invariants

The following conditions must **always** be true:

- Every request has a requestId
- Every API validates input
- No controller contains business logic
- No service formats responses
- No query contains business rules
- Observability is always active

If any invariant is violated, the implementation is non-compliant.

## Summary

The request lifecycle is the **backbone** of this system.

It exists to:

- Eliminate ambiguity
- Enforce discipline
- Protect system integrity
- Enable safe team scaling

All future guidelines refine **how to operate within this lifecycle**, not how to change it.
