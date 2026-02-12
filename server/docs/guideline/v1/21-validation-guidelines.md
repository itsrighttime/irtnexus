# Validation Guidelines

## Purpose

This document defines **how input validation must be designed, structured, and enforced** across the system.

Validation is responsible for:

- Input correctness
- Input safety
- Input normalization

Validation is **not** responsible for:

- Business rules
- Authorization
- Persistence checks

---

## What Validation Is (In This System)

Validation answers only one question:

> “Is this input syntactically valid, safe, and structurally correct?”

If the answer is **no**, the request must fail immediately.

---

## Validation Layer Responsibilities

Validators must:

- Validate all external input
- Sanitize unsafe fields
- Normalize data types
- Return a consistent validation result

Validators must not:

- Call databases
- Call services
- Contain business logic
- Perform authorization checks

---

## Mandatory Validation Coverage

Validation is required for:

- Request body
- Query parameters
- URL parameters
- Headers (if used for logic)

No client-controlled input is trusted without validation.

---

## Validator File Structure

Validators must be organized by domain:

```
validations/
├── user/
│   ├── sendOtp.validation.js
│   └── registerUser.validation.js
├── auth/
│   └── login.validation.js
```

### Rules

- One validator per use case
- No shared “generic” validators
- File name must match controller intent

---

## Validator Interface Contract

Every validator **must return** a standardized object:

```
{
  valid: boolean,
  value: sanitizedPayload,
  errors?: details
}
```

Controllers must rely **only** on this contract.

---

## Validation Execution Rules

- Validation must be synchronous or async-safe
- Validators must be deterministic
- Validation must complete before any service call

If validation fails, execution stops.

---

## Schema-Driven Validation

All validation must be schema-based.

Schemas must:

- Explicitly define required vs optional fields
- Enforce type correctness
- Enforce length, format, and pattern rules
- Reject unknown fields by default (preferred)

---

## Field Normalization Rules

Validators are responsible for:

- Trimming strings
- Applying default values
- Removing unsafe characters
- Normalizing casing where required

Controllers and services must assume validated data is safe.

---

## Optional vs Required Fields

Rules:

- Required fields must be explicitly marked
- Optional fields must have safe defaults
- Empty strings must be treated intentionally

Implicit optionality is forbidden.

---

## Cross-Field Validation

Allowed:

- Structural checks (e.g., `startDate < endDate`)
- Dependent field presence (e.g., `otp` requires `reservationToken`)

Forbidden:

- Business rule checks
- State-based checks

If cross-field logic depends on system state, move it to services.

---

## Validation Error Handling

Validators must not:

- Throw errors
- Log errors
- Format HTTP responses

Validators must:

- Return structured validation failures
- Provide machine-readable error details

Controllers handle response mapping.

---

## Internationalization & Messages

Validators must not:

- Translate messages
- Return user-facing strings

Validators return **codes or raw error metadata** only.

Localization happens later.

---

## Security Requirements

Validators must protect against:

- SQL injection vectors
- XSS payloads
- Oversized payloads
- Type confusion
- Unicode normalization issues

Validation is the **first security gate**.

---

## Reusability Rules

Validators:

- Are reusable within the same domain
- Must not be reused across unrelated domains
- Must not depend on controller logic

Copying schemas is preferred over over-generalization.

---

## Testing Expectations

Each validator must have tests for:

- Valid input
- Missing required fields
- Invalid formats
- Boundary conditions
- Malicious payloads

Validators must be tested independently.

---

## Anti-Patterns (Strictly Forbidden)

- Validation inside controllers
- Inline field checks
- Business logic in validators
- Database lookups
- Conditional rules based on environment

---

## Review Checklist (Validation)

During review, verify:

- Schema is explicit and complete
- No business logic exists
- No external dependencies are used
- Output matches validator contract
- All fields are sanitized

---

## Summary

Validation is a **gatekeeper**, not a decision-maker.

Its job is to:

- Accept safe input
- Reject everything else

Nothing more.
