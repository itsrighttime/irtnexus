# Development Guidelines – File Kit Structure

## Root Folder

```
/guidelines
```

This folder is **read-only** for most developers and treated as **source-of-truth**.

## 1. Foundation & Philosophy (Why This Exists)

### 1.1 `00-overview.md`

**Purpose**

- Explains _why_ these guidelines exist
- Explains the problems they solve (team scale, security, observability)

**Answers**

- Why this architecture is mandatory
- What problems occur if it’s not followed
- Who must follow it (everyone, no exceptions)

### 1.2 `01-core-principles.md`

**Purpose**

- Defines non-negotiable engineering principles

**Covers**

- Separation of concerns
- Deterministic request flow
- Observability by default
- Fail-fast validation
- No hidden side effects

This is the **ideological contract**.

## 2. Request Lifecycle (The Spine of the System)

### 2.1 `10-request-lifecycle.md`

**Purpose**

- High-level lifecycle overview

**Covers**

- End-to-end flow (Client → Response)
- Mandatory vs optional stages
- What is framework-enforced vs developer-enforced

This is the **mental model** document.

### 2.2 `11-middleware-guidelines.md`

**Purpose**

- Rules for writing and using middlewares

**Covers**

- Language middleware
- Request context middleware
- Ordering rules
- What middleware can and cannot do

### 2.3 `12-routing-guidelines.md`

**Purpose**

- Enforces how routes must be structured

**Covers**

- public vs private
- index.js responsibilities
- route file responsibilities
- Forbidden patterns (logic in routes)

## 3. API Construction Layers (How to Build an API)

### 3.1 `20-controller-guidelines.md`

**Purpose**

- Defines what a controller is and is not

**Covers**

- Validation-first rule
- Service invocation rules
- Error handling rules
- Forbidden patterns

This file **kills fat controllers**.

### 3.2 `21-validation-guidelines.md`

**Purpose**

- Input contract enforcement

**Covers**

- Validator structure
- Schema design
- One-validator-per-API rule
- Validation vs sanitization

### 3.3 `22-service-guidelines.md`

**Purpose**

- Business logic contract

**Covers**

- executeAction mandatory usage
- Handler responsibilities
- Action metadata
- Resource modeling

This is the **most critical enforcement document**.

### 3.4 `23-query-guidelines.md`

**Purpose**

- Data access discipline

**Covers**

- Query file structure
- Transaction usage
- Connection passing rules
- No business logic in queries

## 4. Cross-Cutting Concerns (Shared Infrastructure)

### 4.1 `30-response-contract.md`

**Purpose**

- Standardize API responses

**Covers**

- RESPONSE utility usage
- Unique code generation
- requestId & auditId propagation
- Redirect handling

### 4.2 `31-error-handling-guidelines.md`

**Purpose**

- Unified error behavior

**Covers**

- When to throw vs return errors
- Service-level errors
- Controller-level errors
- Global error handler responsibilities

### 4.3 `32-observability-guidelines.md`

**Purpose**

- Observability enforcement

**Covers**

- Prometheus metrics
- Logging rules
- Traceability guarantees
- What must never be logged

## 5. Security & Compliance (Non-Functional but Mandatory)

### 5.1 `40-security-boundaries.md`

**Purpose**

- Defines security responsibility per layer

**Covers**

- Auth belongs where
- No trust in client input
- Actor & audit handling
- Session & token boundaries

### 5.2 `41-data-handling-guidelines.md`

**Purpose**

- Safe data practices

**Covers**

- PII handling
- Logging restrictions
- Encryption boundaries
- Cache safety (Redis, etc.)

## 6. Supporting Infrastructure

### 6.1 `50-configuration-guidelines.md`

**Purpose**

- Config discipline

**Covers**

- config folder usage
- Environment separation
- No hardcoded values

### 6.2 `51-translation-guidelines.md`

**Purpose**

- i18n enforcement

**Covers**

- translate() usage
- No hardcoded user messages
- Language fallback rules

### 6.3 `52-package-guidelines.md`

**Purpose**

- External dependency control

**Covers**

- packages folder rules
- Wrapping third-party libs
- Versioning discipline

## 7. Documentation & Contracts

### 7.1 `60-swagger-guidelines.md`

**Purpose**

- API documentation discipline

**Covers**

- Swagger file structure
- Request/response parity
- Error code documentation

### 7.2 `61-api-versioning.md`

**Purpose**

- Version safety

**Covers**

- `/v1`, `/v2` rules
- Backward compatibility
- Deprecation policy

## 8. Enforcement & Quality Gates (This Forces Compliance)

### 8.1 `70-anti-patterns.md`

**Purpose**

- Explicitly show what NOT to do

**Covers**

- Fat controllers
- Inline SQL
- Skipping validation
- Direct res.json usage

This is extremely effective for juniors.

### 8.2 `71-code-review-checklist.md`

**Purpose**

- PR enforcement checklist

**Covers**

- Layer correctness
- Validation existence
- executeAction usage
- Observability impact

### 8.3 `72-onboarding-playbook.md`

**Purpose**

- New developer onboarding

**Covers**

- How to read these guidelines
- First API walkthrough
- Common mistakes

## 9. Reference Implementations (Living Examples)

### 9.1 `90-reference-api-send-otp.md`

**Purpose**

- Canonical example (your send-otp API)

**Covers**

- Full file tree
- Step-by-step execution
- Mapping to guidelines

### 9.2 `91-template-api-skeleton.md`

**Purpose**

- Copy-paste safe starting point

**Covers**

- Empty controller
- Validator stub
- Service stub
- Query stub

## Final Summary (Why This Works)

This kit:

- Scales with team size
- Prevents architectural drift
- Makes reviews objective, not opinion-based
- Converts “best practices” into **rules**
