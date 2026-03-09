# Middleware Guidelines

## Purpose

This document defines **mandatory rules** for writing, ordering, and using middlewares in this system.

Middlewares operate at the **most sensitive point** in the request lifecycle.
A poorly designed middleware can:

- Break observability
- Introduce security vulnerabilities
- Corrupt request context
- Create non-deterministic behavior

For this reason, middleware design is **intentionally restricted**.

## What Is a Middleware in This System

A middleware is a function that:

- Executes **before routing**
- Applies **cross-cutting concerns**
- Does **not** contain business logic
- Applies to **multiple APIs**

If logic is specific to a single API or domain, it **does not belong in middleware**.

## Mandatory Middleware Ordering

Middleware execution order is **fixed and enforced**.

### Required Order

1. Security & server configuration
2. CORS configuration
3. i18n initialization
4. Language resolution middleware
5. Request body parsing
6. Session middleware
7. Request context middleware
8. Routing
9. Global error handler

### Why Order Matters

- Language must be resolved before translation is used
- Request context must exist before observability starts
- Parsing must occur before validation
- Error handling must be last

Reordering middlewares without approval is prohibited.

## Required Core Middlewares

The following middlewares **must exist** and **must not be bypassed**.

### Language Middleware

**Responsibility**

- Resolve and store the active language

**Rules**

- Use request-scoped storage
- Read from headers or query only
- Provide a getter function

**Forbidden**

- Attaching language directly to `req`
- Reading headers outside this middleware

### Request Context Middleware

**Responsibility**

- Attach execution metadata
- Start and finalize observability

**Rules**

- Must run exactly once per request
- Must initialize requestId and traceId
- Must not be overridden downstream

**Forbidden**

- Modifying context in controllers or services
- Creating additional request IDs

## Middleware Design Rules

### Allowed Responsibilities

A middleware **may**:

- Read request metadata
- Attach context
- Initialize monitoring
- Apply global policies
- Short-circuit requests for security reasons

### Forbidden Responsibilities

A middleware **must not**:

- Implement business logic
- Call services or queries
- Perform domain-specific validation
- Modify response bodies
- Depend on controller logic

## Statelessness Requirement

Middlewares must be:

- Stateless across requests
- Deterministic in execution
- Safe for concurrent execution

Allowed:

- Request-scoped storage
- Immutable configuration reads

Forbidden:

- Global mutable state
- Caching request-specific data globally

## Error Handling in Middlewares

### Rules

- Expected failures must be handled explicitly
- Unexpected errors must be passed to the global error handler
- Middlewares must not swallow errors

### Forbidden

- `try/catch` blocks that hide failures
- Sending partial responses

## Short-Circuiting Requests

A middleware may terminate a request **only** for:

- Authentication failure
- Authorization failure
- Invalid protocol usage
- Security violations

When doing so:

- Use standardized error responses
- Ensure observability is finalized

## Middleware Composition

### Rules

- One responsibility per middleware
- No middleware chaining logic inside middleware
- Composition is handled in server bootstrap only

## Testing Requirements

All custom middlewares must have:

- Unit tests for expected behavior
- Tests for failure paths
- Tests verifying non-interference with context

## Review Checklist (Middleware)

During review, confirm:

- Correct ordering
- No business logic
- No service or query calls
- No state leakage
- Proper error propagation

## Common Anti-Patterns

- Middleware performing validation
- Middleware modifying request payload
- Middleware calling database
- Middleware creating side effects

All are strictly forbidden.

## Summary

Middlewares define the **behavioral contract** of the system.

They must:

- Be minimal
- Be predictable
- Be safe
- Be enforceable

If in doubt, the logic **does not belong in middleware**.
