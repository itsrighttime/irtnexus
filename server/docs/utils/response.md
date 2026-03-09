# **iRtNexus – ResponseService Developer Guide**

## **Overview**

`ResponseService` is a **centralized, standardized response handler** for all API endpoints in iRtNexus.

It ensures:

- **Consistent response structure** across modules
- Automatic **unique codes** (`SECU-IN-...` or `SECU-ER-...`) for tracking and logging
- Inclusion of **metadata** like `requestId` and `auditId`
- Clear differentiation between `SUCCESS`, `ERROR`, and `INFO` responses

The service is built for **Fastify + TypeScript** and is intended to replace scattered response logic with a single, maintainable pattern.

## **Response Structure**

All responses follow this format:

```ts
{
  status: "SUCCESS" | "ERROR" | "INFO",
  code: number,
  message: string,
  uniqueCode: string,
  data?: any,
  errors?: Array<{ field?: string; message: string; code?: string }>,
  meta?: Record<string, any>
}
```

- `status` – response type (`SUCCESS`, `ERROR`, `INFO`)
- `code` – HTTP status code
- `message` – human-readable message
- `uniqueCode` – system-friendly unique code for tracking logs
- `data` – optional payload
- `errors` – optional validation or field errors
- `meta` – optional metadata (`requestId`, `auditId`, custom module info)

## **Importing the Service**

```ts
import { response, STATUS, HTTP_STATUS } from "./services/responseService";
```

- `response` – main object with helper methods (`success`, `error`, `info`)
- `STATUS` – constants for status types (`SUCCESS`, `ERROR`, `INFO`)
- `HTTP_STATUS` – predefined HTTP status codes

## **Usage Guide**

### **1️⃣ Success Response**

Use when an operation completes successfully.

```ts
response.success(request, reply, data?, message?, uniqueCode?, meta?)
```

- **Parameters** (in order):
  1. `request` – FastifyRequest
  2. `reply` – FastifyReply
  3. `data` – payload to return (optional, default `null`)
  4. `message` – message string (optional, default `"Success"`)
  5. `uniqueCode` – unique tracking code (optional, default `"N/A"`)
  6. `meta` – additional metadata (optional)

**Example:**

```ts
response.success(
  request,
  reply,
  { userId: 101 },
  "User retrieved successfully",
  "USER_FOUND",
);
```

**Response:**

```json
{
  "status": "SUCCESS",
  "code": 200,
  "message": "User retrieved successfully",
  "uniqueCode": "SECU-IN-USER_FOUND",
  "data": { "userId": 101 },
  "meta": { "requestId": "abc-123" }
}
```

### **2️⃣ Error Response**

Use for general or application errors.

```ts
response.error(request, reply, errors?, message?, uniqueCode?, code?, meta?)
```

- **Parameters (in order):**
  1. `request` – FastifyRequest
  2. `reply` – FastifyReply
  3. `errors` – array of field errors (optional)
  4. `message` – error message (optional, default `"Internal Server Error"`)
  5. `uniqueCode` – unique code (optional, default `"N/A"`)
  6. `code` – HTTP status (optional, default `500`)
  7. `meta` – additional metadata

**Example – Simple Error:**

```ts
response.error(
  request,
  reply,
  undefined,
  "User not found",
  "USER_NOT_FOUND",
  HTTP_STATUS.x4_NOT_FOUND,
);
```

**Example – With Field Errors:**

```ts
response.error(
  request,
  reply,
  [
    { field: "email", message: "Email is required" },
    { field: "password", message: "Password must be 6+ characters" },
  ],
  "Validation failed",
  "USER_INVALID",
  HTTP_STATUS.x4_UNPROCESSABLE_ENTITY,
);
```

**Response JSON:**

```json
{
  "status": "ERROR",
  "code": 422,
  "message": "Validation failed",
  "uniqueCode": "SECU-ER-USER_INVALID",
  "errors": [
    { "field": "email", "message": "Email is required" },
    { "field": "password", "message": "Password must be 6+ characters" }
  ],
  "meta": { "requestId": "abc-123" }
}
```

### **3️⃣ Info Response**

Use for notifications, warnings, or informational messages.

```ts
response.info(request, reply, message, data?, uniqueCode?, code?, meta?)
```

- **Parameters:**
  1. `request` – FastifyRequest
  2. `reply` – FastifyReply
  3. `message` – info message (required)
  4. `data` – optional payload
  5. `uniqueCode` – optional unique code
  6. `code` – optional HTTP code (default `200`)
  7. `meta` – optional metadata

**Example:**

```ts
response.info(
  request,
  reply,
  "Your session will expire soon",
  { minutesLeft: 5 },
  "SESSION_WARNING",
);
```

**Response JSON:**

```json
{
  "status": "INFO",
  "code": 200,
  "message": "Your session will expire soon",
  "uniqueCode": "SECU-IN-SESSION_WARNING",
  "data": { "minutesLeft": 5 },
  "meta": { "requestId": "abc-123" }
}
```

### **4️⃣ Notes for Developers**

- **Always provide a `uniqueCode`** to make debugging easier and track logs across modules.
- **Optional `meta`** can include `requestId`, `auditId`, or module-specific context.
- **Errors** can be a simple array of messages or field-specific objects.
- `#send` is private and should **never be called directly** — always use `success`, `error`, or `info`.
- **HTTP codes** default to `200` for success/info and `500` for errors but can be overridden.

### **5️⃣ Example: User Registration Flow**

```ts
if (!req.body.email || !req.body.password) {
  return response.error(
    request,
    reply,
    [
      { field: "email", message: "Email is required" },
      { field: "password", message: "Password must be 6+ characters" },
    ],
    "Registration failed",
    "REG_VALIDATION_FAILED",
    HTTP_STATUS.x4_UNPROCESSABLE_ENTITY,
  );
}

try {
  const user = await UserService.create(req.body);
  return response.success(
    request,
    reply,
    user,
    "Registration successful",
    "USER_REGISTERED",
  );
} catch (err) {
  return response.error(
    request,
    reply,
    undefined,
    "Unable to register user",
    "USER_REGISTRATION_FAILED",
  );
}
```

### **Summary**

| Method    | Status  | Default HTTP | Notes                                                             |
| --------- | ------- | ------------ | ----------------------------------------------------------------- |
| `success` | SUCCESS | 200          | Use for successful operations                                     |
| `error`   | ERROR   | 500          | Use for server errors or validations; supports field-level errors |
| `info`    | INFO    | 200          | Use for warnings or informational messages                        |

This version of the guide aligns with the **final simplified ResponseService** — easy for developers to adopt, consistent parameter ordering, and ready for team-wide use.
