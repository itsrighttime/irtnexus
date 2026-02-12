# Data Handling Guidelines

## Purpose

This document defines **strict rules for handling data throughout the system**.

Goals:

- Protect sensitive information
- Ensure data consistency
- Comply with privacy and regulatory requirements
- Reduce accidental data leaks

All developers must follow these rules **without exception**.

## Data Classification

All data must be classified before use:

1. **Public Data** – safe to share externally (e.g., usernames, non-sensitive metadata)
2. **Confidential Data** – restricted internally (e.g., emails, phone numbers)
3. **Sensitive Data** – must never be exposed outside controlled boundaries (e.g., passwords, tokens, OTPs, PII)
4. **Internal System Data** – for system use only (e.g., DB IDs, audit logs, internal flags)

## Data Input Guidelines

- **Validate everything**: Use validators at the controller layer for all client input
- **Sanitize inputs**: Remove dangerous characters, HTML tags, and scripts
- **Reject invalid formats early**: Return domain errors, do not allow partial data
- **Do not trust defaults**: Assume missing fields may be malicious

## Data Storage Guidelines

### Database Storage

- Store **encrypted sensitive data**
  - Passwords: use strong hashing (bcrypt, Argon2)
  - Tokens: encrypt at rest

- Use explicit schemas: avoid dynamic/untyped fields
- Soft deletes: mark records with `is_deleted`, do not physically remove unless required by policy

### Cache / Redis

- Sensitive data in cache must be **short-lived**
- Tokens, OTPs, reservation data must have TTLs
- Never persist permanent secrets in memory caches

### Files / External Storage

- Encrypt sensitive files
- Apply access control
- Audit file accesses

## Data Output Guidelines

- Only return data **explicitly allowed** by the API contract
- Never expose internal IDs, DB flags, or raw objects
- Mask sensitive fields in responses (e.g., `****` or truncated)
- Use translations/localization for user-facing messages

## Data Transmission Guidelines

- Use **HTTPS / TLS 1.2+** for all external communications
- Headers, cookies, and tokens must be validated
- Never pass secrets in query strings
- Sensitive data must not be logged during transit

## Data Consistency & Transactions

- Services own consistency rules, queries only execute actions
- Transactions should **wrap all multi-step operations**
- Partial updates must not leave data in inconsistent state
- All write operations must be idempotent where possible

## Data Access Guidelines

- Access must follow **least privilege principle**
- Services should query only required fields
- Queries should **never access unrelated domains**
- Cross-tenant or cross-user access requires explicit service-level authorization

## Data Retention & Deletion

- Retain data **only as long as needed**
- Follow regulatory and internal retention policies
- Ensure proper deletion of sensitive data when requested or expired
- Soft delete first, permanent delete after verification

## Data in Logs & Observability

- **Never log secrets**: passwords, tokens, OTPs
- Logs may contain IDs for correlation but must be sanitized
- Audit logs must store immutable records of sensitive operations but mask raw secrets

## Data in Testing & Development

- Never use production PII in dev or test environments
- Use anonymized or synthetic data
- Ensure test databases are isolated

## Anti-Patterns (Strictly Forbidden)

- Returning raw database objects in responses
- Logging sensitive fields
- Storing unencrypted sensitive data
- Trusting client input without validation
- Sharing confidential data across domains without authorization

## Review Checklist

- All inputs validated
- Sensitive data encrypted at rest and in transit
- Response contracts followed
- No secrets in logs
- Transactions preserve consistency
- Compliance with retention/deletion policies

## Summary

Data handling is **a security, privacy, and reliability concern**.
Follow these guidelines to ensure:

- No accidental data leaks
- Strong compliance posture
- Consistent and safe data workflows
