# Routing Guidelines

## Purpose

This document defines **strict rules** for designing, organizing, and implementing routes.

Routes are the **entry point** of the system.
Their job is **declarative**, not procedural.

A route must:

- Declare **what endpoint exists**
- Declare **who can access it**
- Forward execution to a controller

A route must **never** contain logic.

## What a Route Is (In This System)

A route is a thin mapping layer that connects:

```
HTTP Method + URL → Controller
```

Nothing else.

If logic exists inside a route, the design is already broken.

## Mandatory Route Folder Structure

Routes must be organized as follows:

```
routes/
├── public/
│   ├── index.js
│   ├── user.route.js
│   └── auth.route.js
├── private/
│   ├── index.js
│   ├── user.route.js
│   └── subscription.route.js
```

### Rules

- `public/` contains unauthenticated routes
- `private/` contains authenticated routes
- No mixed-access routes in the same file
- `index.js` is the only aggregation point

## Public vs Private Routes

### Public Routes

Public routes:

- Do not require authentication
- May still apply rate limiting
- Must not access user context

Examples:

- Login
- Signup
- Public metadata
- Health checks

### Private Routes

Private routes:

- Require authentication middleware
- May rely on request actor
- Must assume identity is present

Examples:

- User profile
- Subscription management
- Admin actions

## Route File Responsibilities

A route file **may only**:

- Declare HTTP methods
- Define URL paths
- Attach middleware (auth, rate-limit)
- Reference controllers

A route file **must not**:

- Contain business logic
- Perform validation
- Transform requests
- Call services or queries

## Route Definition Pattern

### Required Pattern

Each route must follow this structure:

1. HTTP method
2. URL path
3. Middleware (if any)
4. Controller reference

No inline handlers are allowed.

## Endpoint Granularity Rules

### One Endpoint = One Controller

Rules:

- Each endpoint maps to exactly one controller function
- Controllers must not be reused across unrelated routes
- Shared logic belongs in services, not controllers or routes

## URL Design Rules

### General Rules

- URLs must be **resource-oriented**
- Use nouns, not verbs
- Use pluralized resources

Correct:

```
GET /users
POST /users
GET /users/:id
```

Incorrect:

```
POST /getUsers
POST /createUser
```

### Versioning

API versioning must be handled at the routing level.

Example:

```
/api/v1/users
/api/v2/users
```

Controllers must not contain version checks.

## HTTP Method Rules

| Method | Usage                |
| ------ | -------------------- |
| GET    | Read-only operations |
| POST   | Create resources     |
| PUT    | Full replacement     |
| PATCH  | Partial update       |
| DELETE | Resource deletion    |

Misusing HTTP verbs is prohibited.

## Middleware Usage in Routes

Routes may attach only **cross-cutting middleware**, such as:

- Authentication
- Authorization
- Rate limiting
- Feature flags

Routes must **not** attach:

- Validation logic
- Business rules
- Data access logic

## Controller Binding Rules

Routes must reference controllers by import.

Forbidden:

- Inline anonymous functions
- Arrow functions inside route definitions
- Lambdas containing logic

## Index File Rules

Each `index.js` must:

- Import all route files
- Attach them to a base path
- Export a single router instance

No routes should be declared directly inside `index.js`.

## Error Handling in Routes

Rules:

- Routes must not catch errors
- Errors must bubble to global error handler
- Routes must not send responses directly

## Testing Expectations

Routes must be covered by:

- Integration tests
- Authorization tests
- Access control tests

Routes do **not** require unit tests.

## Common Anti-Patterns

Strictly forbidden:

- Logic inside route handlers
- Validation in routes
- Calling services from routes
- Conditional routing logic
- Dynamic route registration at runtime

## Review Checklist (Routes)

During review, verify:

- Correct public/private placement
- No logic in routes
- Proper controller mapping
- Proper HTTP verb usage
- Clean URL design

## Summary

Routes define **what exists**, not **how it works**.

They must:

- Be declarative
- Be predictable
- Be minimal
- Be stable

If a route needs logic, that logic belongs elsewhere.
