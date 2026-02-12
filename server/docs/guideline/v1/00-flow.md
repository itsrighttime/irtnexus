# Request Lifecycle & Application Architecture

This document describes the **request lifecycle** and **application structure** implemented in our system. The lifecycle is intentionally designed to enforce consistency, observability, validation, and separation of concerns.

We classify the request lifecycle into **two categories**:

1. **Compulsory (Framework-Enforced) Flow**
   These components are executed for every request by default and cannot be bypassed.

2. **Developer-Enforced (Convention-Based) Flow**
   API developers must follow defined folder structures and execution sequences to ensure correctness and maintainability.

## 1. Compulsory Request Lifecycle (Default Execution Path)

Every incoming request passes through the following components in a fixed order.

### 1.1 Middleware Layer

When a client sends a request, it first reaches the **middleware layer**, which contains predefined global middlewares.

#### a. Language Middleware

**Purpose**

- Enables multi-language support across the system.

**Responsibilities**

- Extracts the language code from request headers.
- Resolves the active language from the configured language store.
- Attaches language context to the request.
- Makes the language accessible throughout the request lifecycle via:

  ```
  GetLanguageContext()
  ```

#### b. Request Context Middleware

**Purpose**

- Enriches the request with contextual and observability metadata.

**Responsibilities**

- Attaches `request.context` with the following properties:

| Property  | Description                           |
| --------- | ------------------------------------- |
| requestId | Generated using `crypto.randomUUID()` |
| traceId   | Generated using `crypto.randomUUID()` |
| auditId   | Initialized as `null`                 |
| actor     | Defaults to `anonymous`               |
| startTime | Request start timestamp               |

- Starts request-level observability:
  - Initializes Prometheus metrics.
  - Tracks request start and completion.

- On request completion:
  - Records metrics.
  - Logs request completion status to the database.

## 2. Routing Layer

After middleware execution, the request moves to the **routing layer**.

### 2.1 Route Organization

Routes are organized under a predefined `routes` folder with two top-level categories:

- `public/` — Publicly accessible APIs
- `private/` — Authenticated or restricted APIs

### 2.2 Context-Based Route Grouping

Within both `public` and `private` folders, routes are further grouped by **domain context**.

**Example**

```
routes/
 ├─ public/
 │   ├─ user.route.js
 │   └─ index.js
 └─ private/
     ├─ user.route.js
     └─ index.js
```

**Pattern**

- Each `*.route.js` file defines endpoints for a specific domain (e.g., users).
- The `index.js` file imports and mounts these routes under a base path (e.g., `/users`).

### 2.3 Endpoint Definition

Final endpoint definitions occur inside the route files:

- HTTP method
- URL path
- Controller reference

Example:

```
POST /users → userController.createUser
```

## 3. Controller Layer

Controllers act as **orchestrators** between validation and business logic.

### 3.1 Controller Organization

Controllers are stored under a `controllers` folder and organized by domain context.

**Example**

```
controllers/
 └─ user/
     ├─ createUser.controller.js
     └─ updateUser.controller.js
```

### 3.2 Validation (Mandatory)

At the **top of every controller**, input validation must be performed.

**Rules**

- Validators are mandatory for all APIs that accept input.
- GET APIs without input parameters may skip validation.

**Validator Structure**

```
validators/
 └─ user/
     ├─ createUser.validator.js
     └─ updateUser.validator.js
```

- One validator per API.
- Uses the system’s inbuilt validation framework.
- Prevents invalid data from reaching business logic.

### 3.3 Controller Responsibility

After validation:

- The controller invokes one or more services.
- No business logic is written inside controllers.
- Controllers only coordinate validation and service execution.

## 4. Service Layer (Business Logic)

All business logic resides in the **service layer**.

### 4.1 Service Execution Model

Every service is executed via a standardized function:

```
executeAction(request, action, resources, handler)
```

**Parameters**

- `request` – enriched request object
- `action` – action identifier
- `resources` – required system resources
- `handler` – function containing the business logic

**Rules**

- All business logic must be implemented inside the `handler`.
- Metadata handling, tracing, and context management are handled by `executeAction`.

### 4.2 Service Composition

- A controller may call multiple services.
- Services may internally call other services if required.
- All services must reside in the `service` folder.

## 5. Database Access Layer (Queries)

Database interaction is strictly isolated from services.

### 5.1 Queries Folder

All database logic is written inside the `queries` folder.

**Structure**

```
queries/
 └─ user/
     ├─ createUser.query.js
     ├─ updateUser.query.js
     └─ getUser.query.js
```

**Rules**

- Services call queries.
- Controllers never access queries directly.
- Queries contain only database logic, no business rules.

## 6. Supporting Folders

### 6.1 Utilities (`utils`)

- Contains reusable, stateless helper functions.
- No side effects or shared state.

### 6.2 Translations (`translations`)

- Stores all language-specific definitions.
- Used by the language middleware and application responses.

### 6.3 Swagger (`swagger`)

- Contains API documentation.
- Organized by domain context.

Example:

```
swagger/
 └─ user/
```

### 6.4 Configuration (`config`)

Centralized configuration for:

- Database
- Internationalization (i18n)
- Environment-specific settings

### 6.5 Packages (`packages`)

- Contains all third-party and internal packages.
- Prevents scattering external dependencies across the codebase.
- Acts as a single integration point for external code.

## 7. End-to-End Flow Summary

```
Client
  ↓
Middleware
  - Language Middleware
  - Request Context Middleware
  ↓
Routes (public/private)
  ↓
Controller
  - Validator
  - Service Invocation
  ↓
Service
  - executeAction
  - Business Logic
  ↓
Queries
  - Database Operations
  ↓
Response
```
