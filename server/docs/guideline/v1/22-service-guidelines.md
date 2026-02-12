# Service Guidelines

## Purpose

This document defines **how business logic must be implemented, structured, and protected**.

Services are the **only layer allowed to make decisions**.

If logic affects:

- system state
- business rules
- workflows
- transactions

…it belongs in the **service layer**.

## What a Service Is (In This System)

A service is a **pure business operation** that:

```
Validated Input + Context → Business Decision → Domain Result
```

Services are **transport-agnostic** and **framework-independent**.

## Service Layer Responsibilities

Services are responsible for:

- Business rule enforcement
- Workflow orchestration
- Transaction boundaries
- Domain error generation
- Audit & action execution hooks

Services are NOT responsible for:

- HTTP concerns
- Validation
- Serialization
- Localization
- Authentication middleware logic

## Service Folder Structure

Services must be organized by domain:

```
services/
├── user/
│   ├── registerUser.step1.service.js
│   ├── registerUser.step2.service.js
│   └── getUser.service.js
├── auth/
│   └── login.service.js
```

### Rules

- One service = one business capability
- File name must express intent
- Step-based workflows must be explicit

## Service Interface Contract

Services must:

- Accept validated payloads only
- Accept request context (`req`) explicitly
- Return domain-level result objects

Services must not return raw HTTP responses.

## Business Logic Ownership

Only services may:

- Decide success vs failure
- Apply conditional rules
- Enforce uniqueness or constraints
- Trigger side effects (email, OTP, etc.)

Controllers must never replicate these rules.

## Transaction Management

### Allowed

- Transactions inside services
- Nested operations within a transaction
- Explicit commit/rollback semantics

### Forbidden

- Transactions in controllers
- Transactions in queries
- Hidden auto-transactions

A service owns its transaction boundary.

## Database Access Rules

Services may:

- Call query functions
- Pass DB connections explicitly
- Control transaction scope

Services must not:

- Embed raw SQL
- Construct dynamic queries
- Mix multiple databases blindly

All DB access must go through query modules.

## External System Interaction

Services are allowed to:

- Call email providers
- Call OTP / Redis services
- Call external APIs

Rules:

- External calls must be isolated
- Failures must be handled deterministically
- No retries without explicit policy

## Error Handling & Domain Errors

Services must:

- Return structured domain errors
- Use system error codes
- Avoid throwing unless unrecoverable

Services must not:

- Log transport-level errors
- Return localized messages

Errors propagate upward in structured form.

## Side Effects & Idempotency

Services must be:

- Idempotent where possible
- Defensive against retries
- Explicit about side effects

Side effects must:

- Happen after validations
- Be guarded by state checks

## Request Context Usage

Services may read:

- requestId
- traceId
- actor
- language

Services may set:

- auditId
- action metadata

Services must not mutate global context.

## Observability & Auditing

Services are the correct place for:

- Action execution wrappers
- Audit trail creation
- Domain-level logging

Controllers must not handle auditing.

## Complexity Rules

If a service:

- Exceeds ~150 lines
- Has >3 nested branches
- Manages multiple workflows

Split it into:

- Coordinator service
- Sub-services

## Testing Expectations

Each service must have tests for:

- Happy path
- Rule violations
- State conflicts
- Transaction rollbacks
- Idempotent retries

Mock external systems explicitly.

## Anti-Patterns (Strictly Forbidden)

- Business logic in controllers
- SQL inside services
- HTTP status handling
- Localization
- Silent failures

## Review Checklist (Services)

During review, verify:

- Business rules are centralized
- No validation logic exists
- Transaction scope is clear
- Queries are isolated
- Side effects are explicit

## Summary

Services are the **brain of the system**.

They:

- Decide
- Enforce
- Orchestrate

Everything else supports them.
