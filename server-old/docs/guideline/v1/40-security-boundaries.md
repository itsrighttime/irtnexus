# Security Boundaries

## Purpose

This document defines **where security responsibilities start and end** in the system.

Security here is not limited to authentication.
It includes:

- trust boundaries
- data exposure limits
- privilege separation
- developer responsibility boundaries

If boundaries are unclear, **security will be violated**.

## Core Security Principle

> **Never trust input. Never trust state. Never trust developers to “remember”.**

Security must be enforced by **architecture**, not convention.

## Trust Zones

The system is divided into strict trust zones:

1. **Client Zone** (Untrusted)
2. **Transport Zone** (Untrusted)
3. **Controller Zone** (Minimally trusted)
4. **Service Zone** (Trusted logic)
5. **Query / DB Zone** (Highly restricted)
6. **Infrastructure Zone** (Critical)

Data must move **only downward** through zones.

## Client Zone (Untrusted)

Includes:

- browsers
- mobile apps
- external services

Rules:

- No client input is trusted
- No assumptions about identity
- No assumptions about intent

All client input must be:

- validated
- sanitized
- contextually verified

## Transport Boundary (HTTP Layer)

Includes:

- headers
- cookies
- query params
- body

Rules:

- Headers are not authentication
- IPs are not identity
- Cookies are not authorization

Transport data is **pure input**, nothing more.

## Controller Security Boundary

Controllers are **not trusted** with security decisions.

Controllers may:

- invoke validators
- invoke services
- forward responses

Controllers must not:

- authorize actions
- infer identity
- check permissions
- enforce business security rules

Controllers are **traffic directors**, not guards.

## Authentication Boundary

Authentication must occur:

- before private routes
- in dedicated middleware
- exactly once per request

Rules:

- Auth middleware enriches `req.context.actor`
- Controllers/services must never parse tokens
- Anonymous is the default actor

Authentication answers:

> “Who is making this request?”

Nothing else.

## Authorization Boundary

Authorization belongs to the **service layer**.

Services must decide:

- whether an actor can perform an action
- whether a resource is accessible
- what scope applies

Rules:

- No authorization in middleware (except coarse gating)
- No authorization in controllers
- No authorization in queries

Authorization answers:

> “Is this actor allowed to do this now?”

## Service Security Boundary (Critical)

Services are the **primary security enforcement layer**.

Services must:

- validate actor permissions
- enforce ownership rules
- prevent privilege escalation
- protect workflows from misuse

Every service must assume:

- caller may be malicious
- request may be replayed
- state may be stale

## Query / Database Boundary

The database is **not a security layer**.

Rules:

- Never rely on DB constraints for authorization
- Never assume filtered queries are “secure”
- DB enforces integrity, not permission

Queries must be treated as:

> “Dumb executors of intent”

## Data Exposure Rules

### Allowed to Return to Clients

- public identifiers
- non-sensitive metadata
- explicitly approved fields

### Forbidden to Return

- internal IDs
- system flags
- audit fields
- security state
- raw database rows

Expose data intentionally.

## Secrets & Sensitive Data

Secrets include:

- passwords
- OTPs
- tokens
- API keys
- encryption material

Rules:

- Never log secrets
- Never return secrets
- Never store secrets in plain text
- Never pass secrets across layers unnecessarily

Secrets must be:

- short-lived
- scoped
- revocable

## Multi-Tenancy & Isolation

If multi-tenant:

- tenant context must be explicit
- cross-tenant access is forbidden
- tenant must be validated in services

Never infer tenant from:

- subdomain
- header
- request path alone

## Internal vs External APIs

Internal APIs:

- still follow same validation
- still follow same authorization
- still use same response contract

“Internal” does not mean “trusted”.

## Defense-in-Depth Rules

Security must exist at:

- validation
- authentication
- authorization
- workflow design
- observability

No single layer is sufficient.

## Failure Security

On failure:

- fail closed, not open
- do not leak context
- do not reveal existence of resources unnecessarily

Error messages must be safe.

## Anti-Patterns (Strictly Forbidden)

- Authorization in controllers
- Trusting client-provided IDs
- Relying on frontend validation
- Logging sensitive data
- “Temporary” bypasses

There is no temporary in security.

## Review Checklist (Security)

During review, verify:

- trust boundaries are respected
- authorization exists in services
- sensitive data is protected
- no layer oversteps responsibility

If unclear, reject.

## Summary

Security is enforced by **where code is allowed to exist**.

Boundaries:

- prevent mistakes
- limit blast radius
- protect the system from ourselves
