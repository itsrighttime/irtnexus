Here’s how the **full request lifecycle actually flows in Fastify**, in the real order it executes when a request hits your server:

## 🔄 Complete Fastify Request Lifecycle

```txt
Incoming Request
   ↓
onRequest
   ↓
preParsing
   ↓
Parsing (body parsing happens here)
   ↓
preValidation
   ↓
Validation (JSON schema check)
   ↓
preHandler
   ↓
Route Handler
   ↓
preSerialization
   ↓
onSend
   ↓
Response sent to client
   ↓
onResponse
```

## 🧩 What Each Step _Actually Does_

### 1. **onRequest**

- First thing that runs
- No body yet (stream not read)
- Used for:
  - Logging
  - Rate limiting
  - Very early auth checks

### 2. **preParsing**

- Before body parsing
- You can:
  - Modify raw request stream
  - Handle compressed payloads

### 3. **Parsing**

- Fastify parses JSON/body here
- After this → `request.body` is available

### 4. **preValidation**

- Runs **before schema validation**
- Perfect for:
  - Normalizing input
  - Adding missing fields
  - Transforming data

👉 This is where your `normalizeRegisterTenant` runs

### 5. **Validation**

- Fastify validates using your schema (`registerTenantSchema`)
- If invalid → request stops here ❌

### 6. **preHandler**

- Runs after validation
- Common use:
  - Authentication (JWT/session)
  - Authorization
  - DB lookups

### 7. **Handler (your route function)**

```ts
async (request, reply) => { ... }
```

- Runs only if everything above passed
- Business logic lives here

### 8. **preSerialization**

- Before response is serialized
- You can:
  - Modify response object
  - Shape output

### 9. **onSend**

- Right before response goes out
- You can:
  - Add headers
  - Modify payload (string/buffer)

### 10. **onResponse**

- After response is sent
- Used for:
  - Logging
  - Metrics
  - Cleanup

## ⚠️ Important Behavior

- If **any step throws an error**, Fastify:
  → skips remaining steps
  → jumps to error handler

## 🧠 Quick Mental Model

Think of it like:

```txt
Request comes in
→ Prepare it
→ Parse it
→ Clean it
→ Validate it
→ Authorize it
→ Handle it
→ Format response
→ Send response
→ Log completion
```

**Full Fastify route implementation** that demonstrates **all the lifecycle hooks** in a single request—from `onRequest` to `onResponse`. Here’s a complete example for your `/register` route:

```ts
import Fastify, { FastifyRequest, FastifyReply } from "fastify";

const fastify = Fastify({ logger: true });

// Example JSON schema for registration
const registerTenantSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string", minLength: 1 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
    },
  },
};

// Example input type
interface RegisterTenantInput {
  name: string;
  email: string;
  password: string;
}

// Pre-validation hook: normalize input
async function normalizeRegisterTenant(
  request: FastifyRequest<{ Body: RegisterTenantInput }>,
  reply: FastifyReply,
) {
  const body = request.body;
  body.name = body.name.trim();
  body.email = body.email.toLowerCase();
}

// Pre-handler hook: authentication/authorization
async function checkAuthorization(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // For example, allow all for now
  console.log("Authorization check passed");
}

// Pre-serialization hook: modify response before sending
function modifyResponse(reply: FastifyReply, payload: any) {
  if (payload.tenantId) {
    payload.status = "success";
  }
  return payload;
}

// onRequest hook: very first step
fastify.addHook("onRequest", async (request, reply) => {
  console.log("onRequest: Incoming request", request.method, request.url);
});

// preParsing hook: before body parsing
fastify.addHook("preParsing", async (request, reply, payload) => {
  console.log("preParsing: payload received");
});

// onSend hook: right before sending response
fastify.addHook("onSend", async (request, reply, payload) => {
  console.log("onSend: Response about to be sent");
  reply.header("X-Custom-Header", "FastifyLifecycleDemo");
  return payload; // must return payload
});

// onResponse hook: after response is sent
fastify.addHook("onResponse", async (request, reply) => {
  console.log("onResponse: Response sent");
});

// The actual route
fastify.post(
  "/register",
  {
    schema: registerTenantSchema,
    preValidation: normalizeRegisterTenant,
    preHandler: checkAuthorization,
    preSerialization: modifyResponse,
  },
  async (request: FastifyRequest<{ Body: RegisterTenantInput }>, reply) => {
    // Route handler logic
    const { name, email, password } = request.body;

    // Simulate DB save
    const tenantId = Math.floor(Math.random() * 1000);

    console.log("Handler: Tenant registered", { name, email });

    return {
      message: `Tenant ${name} registered successfully`,
      tenantId,
    };
  },
);

// Start server
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
```

### What this code demonstrates:

1. **`onRequest`** → logs raw request info.
2. **`preParsing`** → logs that payload arrived.
3. **Body parsing** → automatic JSON parsing.
4. **`preValidation`** → `normalizeRegisterTenant` cleans input.
5. **Validation** → schema ensures correct data.
6. **`preHandler`** → `checkAuthorization` runs.
7. **Handler** → processes registration, returns data.
8. **`preSerialization`** → `modifyResponse` adds `status` field.
9. **`onSend`** → adds custom headers/logs.
10. **Response sent** → JSON goes to client.
11. **`onResponse`** → final logging.


## A subtle but important distinction in Fastify’s design:

* **Route-specific hooks**: `preValidation`, `preHandler`, `preSerialization` **can be added directly in the route options**—like you did with schema.
* **Global hooks**: `onRequest`, `preParsing`, `onSend`, `onResponse` (and some others) **cannot be added per route in the same object**. They are added via `fastify.addHook()` and apply either **globally** or to a **plugin scope**, but not inline in a single route definition.


### 🔹 Why this is the case

1. **Fastify’s route options object** supports only:

```ts
{
  schema?,
  preValidation?,
  preHandler?,
  preSerialization?,
  onError?  // route-specific error handler
}
```

* These hooks are **designed to be per-route**, since they are the most common for validation and business logic.

2. **Other lifecycle hooks** like `onRequest`, `preParsing`, `onSend`, `onResponse`:

* Are **very early or very late** in the lifecycle.
* They are global or plugin-scoped by design.
* You can, however, **use scoped hooks inside a plugin** if you want them only for certain routes.


### 🔹 How to “scope” these global hooks to a route

You can wrap your route in a plugin:

```ts
import Fastify from "fastify";
const fastify = Fastify();

async function registerTenantPlugin(fastify) {
  fastify.addHook("onRequest", async (req, reply) => {
    console.log("Scoped onRequest for /register");
  });

  fastify.addHook("preParsing", async (req, reply, payload) => {
    console.log("Scoped preParsing for /register");
  });

  fastify.addHook("onSend", async (req, reply, payload) => {
    console.log("Scoped onSend for /register");
    return payload;
  });

  fastify.post(
    "/register",
    {
      schema: registerTenantSchema,
      preValidation: normalizeRegisterTenant,
      preHandler: checkAuthorization,
      preSerialization: modifyResponse,
    },
    async (request, reply) => {
      return { message: "Tenant registered" };
    }
  );
}

fastify.register(registerTenantPlugin);

fastify.listen({ port: 3000 });
```

This way, the **global hooks only apply to the plugin’s routes**, giving you route-level control.


So the **short answer**:

* You **can’t add `onRequest`, `preParsing`, `onSend`, `onResponse` directly in the route options**.
* You **can scope them to a route using a plugin**.
* Hooks like `preValidation`, `preHandler`, `preSerialization` **are special route-level hooks and can go directly in the route object**.
