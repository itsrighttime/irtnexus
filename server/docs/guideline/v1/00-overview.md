Below is a **first-class draft** of `00-overview.md`.
This file sets the **tone, authority, and intent** of the entire guidelines kit. It is deliberately firm, explicit, and non-optional.

You can paste this directly into `guidelines/00-overview.md`.

---

# Development Guidelines – Overview

## Purpose of This Document

This document defines the **official development guidelines** for building, modifying, and maintaining APIs and services within this system.

These guidelines are **not suggestions**.
They exist to enforce **consistency, security, observability, and long-term maintainability** across a growing engineering team.

Any code that does not follow these guidelines is considered **non-compliant** and may be rejected during review, testing, or audit.

---

## Why These Guidelines Exist

As the system scales, the following risks increase significantly:

* Inconsistent request handling
* Missing validation and security checks
* Poor observability and traceability
* Tight coupling between layers
* Hidden business logic in controllers or routes
* Hard-to-debug production issues
* Fragile APIs written differently by each developer

These guidelines exist to **eliminate those risks by design**, not by discipline alone.

They turn architectural decisions into **enforced contracts**.

---

## What These Guidelines Cover

This guideline set defines:

* The **mandatory request lifecycle**
* Responsibilities and boundaries of each layer
* How APIs must be structured
* Where business logic is allowed (and where it is not)
* How validation, errors, logging, and observability are handled
* How data access and transactions are managed
* How cross-cutting concerns (i18n, config, security) are enforced
* How compliance is reviewed and audited

If you are writing **any backend code** in this system, these guidelines apply to you.

---

## What These Guidelines Do NOT Cover

These documents do **not**:

* Teach JavaScript, Node.js, or Express basics
* Explain database fundamentals
* Replace framework documentation
* Describe UI or frontend behavior

They assume you already understand the tools.
They focus on **how those tools must be used in this system**.

---

## Who Must Follow These Guidelines

These guidelines apply to:

* Full-time backend engineers
* Interns and junior developers
* Senior engineers and architects
* Contract or external contributors
* Anyone submitting code to this repository

There are **no role-based exceptions**.

---

## Mandatory vs Optional Behavior

The system is designed with two enforcement layers:

### 1. Framework-Enforced Rules

These are implemented in code and **cannot be bypassed**, such as:

* Middleware execution order
* Request context creation
* Observability hooks
* Response formatting

### 2. Developer-Enforced Rules

These must be followed by convention and review, such as:

* Validation before business logic
* Service-only business logic
* Query-only database access
* Correct folder and file structure

This guideline kit exists primarily to enforce the **second category**.

---

## Source of Truth

This guidelines folder is the **single source of truth** for backend architecture decisions.

If:

* A code comment
* A Slack message
* A verbal instruction
* A previous implementation

Conflicts with these documents, **these documents win**.

---

## How to Use This Guideline Kit

Developers should:

1. Read this overview first
2. Understand the request lifecycle
3. Refer only to the guideline relevant to the layer they are working on
4. Use the reference APIs as templates
5. Use the checklist before opening a pull request

Reviewers should:

* Review code against these documents, not personal preferences
* Reject code that violates defined boundaries
* Request changes with references to specific guideline files

---

## Enforcement Policy

Non-compliance may result in:

* PR rejection
* Mandatory refactoring
* Delayed releases
* Audit findings
* Security risk classification

Repeated or intentional violations may be escalated.

---

## Guiding Principle

> **Consistency is more important than cleverness.
> Predictability is more important than speed.
> Enforcement is more important than preference.**

These guidelines exist to protect:

* The system
* The team
* The users
* The future maintainers

---

## Next Document

After reading this file, continue with:

```
01-core-principles.md
```

This will define the **non-negotiable engineering principles** that govern every layer of the system.

---

If you want, next we can:

* Draft `01-core-principles.md`
* Tighten language for legal/compliance tone
* Add an explicit “Definition of Done” reference
* Or align this with internal security or ISO-style documentation

Tell me the next step.
