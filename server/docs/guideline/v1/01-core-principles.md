# Core Engineering Principles

## Purpose

This document defines the **fundamental engineering principles** that govern the design, implementation, and evolution of this system.

These principles are **non-negotiable**.
All architectural decisions, code changes, and reviews must align with them.

If a proposed implementation violates any principle listed here, the implementation is considered **invalid**, regardless of whether it “works”.

## Principle 1: Deterministic Request Lifecycle

Every request must follow a **predictable, repeatable, and observable lifecycle**.

### What This Means

- All requests pass through the same middleware chain
- Context is always created before business logic
- Observability starts before execution and ends after response
- Responses are always structured the same way

### Why This Matters

- Production debugging depends on predictability
- Observability depends on consistency
- Security depends on known execution order

### Enforced By

- Middleware ordering
- Request context middleware
- RESPONSE utility
- Global error handler

## Principle 2: Strict Separation of Concerns

Each layer in the system has **exactly one responsibility**.

| Layer       | Responsibility            |
| ----------- | ------------------------- |
| Middleware  | Cross-cutting concerns    |
| Routes      | URL-to-controller mapping |
| Controllers | Orchestration only        |
| Validators  | Input contracts           |
| Services    | Business logic            |
| Queries     | Data persistence          |
| Utils       | Stateless helpers         |

### Forbidden

- Business logic in controllers
- Database access in controllers or routes
- Validation inside services
- SQL outside queries

## Principle 3: Validation Before Execution

No untrusted input may reach business logic.

### Rules

- Every API that accepts input must validate it
- Validation happens **before** service execution
- Invalid input must never trigger side effects

### Why This Matters

- Prevents inconsistent state
- Reduces security risk
- Simplifies service logic

## Principle 4: Business Logic Lives in Services Only

All business decisions must be implemented in the **service layer**.

### Rules

- Controllers may call services, not implement logic
- Queries may persist data, not decide outcomes
- Utilities may assist, not decide

### Enforced Pattern

All services must execute via:

```
executeAction({ req, action, resource, handler })
```

This ensures:

- Auditable execution
- Action traceability
- Future authorization enforcement

## Principle 5: Observability Is Mandatory

Every request must be traceable from entry to exit.

### Guarantees

- Every request has a `requestId`
- Every response exposes that `requestId`
- Execution duration is always recorded
- Errors are always logged centrally

### Why This Matters

- Production issues are inevitable
- Silent failures are unacceptable
- Debugging without traces is impossible

## Principle 6: Explicit Error Handling

Errors must be **intentional, structured, and meaningful**.

### Rules

- Known failure cases return structured responses
- Unexpected failures are escalated, not swallowed
- Error codes must be stable and documented

### Forbidden

- Silent failures
- Returning raw exceptions
- Inconsistent error formats

## Principle 7: Data Access Is Isolated

Database access must be isolated from business logic.

### Rules

- Queries contain SQL only
- Services orchestrate transactions
- Controllers never touch the database

### Why This Matters

- Prevents tight coupling
- Simplifies testing
- Enables database changes without rewriting logic

## Principle 8: Stateless Utilities

Utility functions must be:

- Stateless
- Deterministic
- Side-effect free

They must not:

- Access databases
- Modify global state
- Depend on request context

## Principle 9: Configuration Is Centralized

Configuration must be:

- Centralized
- Environment-specific
- Explicit

### Forbidden

- Hardcoded secrets
- Environment-specific logic in services
- Accessing `process.env` outside config

## Principle 10: Security by Construction

Security is not optional or additive.

### Rules

- Assume all input is hostile
- Never trust client state
- Never leak internal errors
- Log safely and intentionally

Security is achieved by **design**, not patches.

## Principle 11: Consistency Over Optimization

Consistency is prioritized over micro-optimizations.

### Why

- Predictable systems scale better
- Inconsistent systems fail silently
- Optimizations without measurements are liabilities

## Principle 12: Enforceability Over Flexibility

Architectural freedom is intentionally limited.

### Why

- Teams scale faster with constraints
- Reviews become objective
- Systems remain maintainable

If flexibility is needed, it must be **explicitly designed**, not improvised.

## Final Statement

> **These principles exist to remove ambiguity.
> Ambiguity is the root cause of bugs, security issues, and architectural decay.**

Any implementation that violates these principles:

- Must be refactored
- Must not be merged
- Must not reach production
