# Real-World Reference Example

## API: `POST /v1/public/users/send-otp`

This API demonstrates the **complete enforced request lifecycle** in irtnexus.

## 0. Server Bootstrap (Framework-Enforced)

### File

```
server.js (or app.js)
```

### Responsibility

This file **defines the immutable execution order** of the system.

Key enforced rules:

- Every request **must** pass through:
  1. CORS
  2. i18n
  3. Language middleware
  4. Session middleware
  5. Request context middleware

- Routes **must** be mounted under `/v1/public` or `/v1/private`
- Global error handling is mandatory

### Relevant Code (Conceptually)

```js
app.use(languageMiddleware);
app.use(express.json());
app.use(sessionMiddleware);
app.use(requestContextMiddleware);

app.use("/v1/public", publicRoutes);
app.use("/v1/private", privateRoutes);

app.use(globalErrorHandler);
```

This ensures:

- No API can bypass language resolution
- No API can bypass request context
- No API can bypass observability & logging

This is **non-negotiable infrastructure**.

## 1. Language Resolution (Compulsory)

### File

```
middlewares/language.middleware.js
```

### What Happens

- A new async context is created per request
- Language is resolved from:
  - Header → Query → Default (`en`)

- Language is stored in `AsyncLocalStorage`

### Why This Is Enforced

- Services, translations, and responses can retrieve language **without passing it manually**
- Prevents developers from “forgetting” language handling

### Access Pattern (Anywhere Later)

```js
getLanguageContext();
```

No controller or service is allowed to read language directly from headers.

## 2. Request Context & Observability (Compulsory)

### File

```
middlewares/requestContext.middleware.js
```

### What Happens

Before any route logic:

- `req.context` is attached with:
  - requestId
  - traceId
  - auditId (lazy)
  - actor (anonymous by default)
  - startTime

- Prometheus metrics start

After response finishes:

- Metrics are finalized
- Request is logged centrally

### Why This Is Enforced

- Guarantees **every request is traceable**
- Guarantees **every response includes requestId**
- Guarantees **observability cannot be skipped**

Developers are **not allowed** to manually create request IDs.

## 3. Route Entry Point (Public API)

### File

```
routes/public/index.js
```

### Responsibility

- Acts as the **only public entry point**
- Groups domain routes

```js
router.use("/users", userRoute);
```

Rule:

- No business logic
- No validation
- No services here

## 4. Domain Route Definition

### File

```
routes/public/user.route.js
```

### Responsibility

- Defines HTTP method + path
- Attaches controller

```js
router.post("/send-otp", sendOTPController);
```

Rules enforced:

- No validation
- No DB access
- No service logic

This file answers **only one question**:

> “Which controller handles this endpoint?”

## 5. Controller Layer (Orchestration Only)

### File

```
controllers/user/sendOtp.controller.js
```

### Responsibilities (Strict)

1. Validate input
2. Call service
3. Return standardized response
4. Handle unexpected errors

### What Happens Here

#### Step 1: Validation (Mandatory)

```js
const validate = await validateSendOtp(req.body);
```

Rules:

- Every payload-based API **must** validate
- Validation happens **before** any service call
- Validation logic is never inline

#### Step 2: Service Invocation

```js
const result = await registerUserStep1(req, payload);
```

Rules:

- Controller does not know how OTP works
- Controller does not touch DB
- Controller does not translate messages

#### Step 3: Response Handling

```js
return RESPONSE.send(req, res, result);
```

This enforces:

- Uniform response format
- requestId always included
- uniqueCode always generated

## 6. Validation Layer (Input Contract)

### File

```
validations/user/register.validation.js
```

### Responsibility

- Define input schema
- Sanitize payload
- Return structured validation result

### Important Enforcement

- One validator per API
- Validators are **pure**
- Validators never throw — they return `{ valid, value, errors }`

Why this matters:

- Controllers stay deterministic
- Validation logic is reusable
- No side effects

## 7. Service Layer (Business Logic Only)

### File

```
services/user/register.service.js
```

### Entry Pattern (MANDATORY)

```js
executeAction({
  req,
  action,
  resource,
  handler,
});
```

This is **the most important enforcement point**.

### What `executeAction` Guarantees

- Action metadata is attached
- Audit hooks can be triggered
- Authorization can be layered later
- Consistent error propagation

### What `handler` Contains

- Actual business rules
- Calls to queries
- Calls to Redis / OTP / reservation
- Transaction boundaries

### What Is Explicitly Forbidden

- Express `req/res` usage inside handler
- Direct response sending
- Inline SQL

## 8. Data Access Layer (Queries Only)

### File

```
queries/user/user.query.js
```

### Responsibility

- SQL only
- No business rules
- Optional transaction support

Example:

```js
export const createUser = async (data, conn = null) => {
  const db = conn ?? userDb;
  return db.execute(sql, params);
};
```

Rules:

- Services call queries
- Controllers NEVER call queries
- Queries NEVER call services

## 9. Cross-Cutting Utilities (Shared)

### RESPONSE Utility

```
utils/response.js
```

Enforces:

- Single response format
- Unique error codes
- requestId propagation
- auditId propagation (if present)

No controller or service is allowed to call `res.json()` directly.

## 10. End-to-End Flow (Concrete)

```
Client
  ↓
Language Middleware
  ↓
Request Context Middleware
  ↓
/v1/public/users/send-otp
  ↓
user.route.js
  ↓
sendOTPController
  ↓
validateSendOtp
  ↓
registerUserStep1
  ↓
executeAction
  ↓
queries + redis + otp
  ↓
RESPONSE.send
```

## Why This Example Is Important

This example becomes the **reference contract**:

- New developers copy this pattern
- Code reviews reject deviations
- Security & observability are guaranteed
- Architecture remains stable as team scales
