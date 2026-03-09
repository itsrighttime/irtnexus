# Swagger / API Documentation Guidelines (JS Format)

## Purpose

Define **how Swagger/OpenAPI documentation is maintained using JavaScript objects**.

Goals:

- Keep docs synchronized with code
- Use centralized, reusable schemas
- Support versioned endpoints
- Provide accurate documentation for frontend, backend, and external consumers

## Core Principles

1. **Documentation as Code**
   - All API docs are **JS objects**, not YAML
   - Changes live alongside code

2. **Centralized Folder**

   ```
   /swagger
     ├─ index.js           # central Swagger config & setup
     ├─ user/
     │    ├─ public.js
     │    └─ private.js
     ├─ auth/
     │    ├─ public.js
     │    └─ private.js
     └─ common-schemas.js  # reusable schemas
   ```

3. **Reusable Components**
   - Define all common objects (e.g., `Response`, `Error`) in `common-schemas.js`
   - Import and reference these schemas in all endpoint docs

## JS Example Structure

```js
// swagger/user/public.js
import { components } from "../common-schemas.js";

export const userPublicPaths = {
  "/v1/public/users/register": {
    post: {
      tags: ["User"],
      summary: "Register a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: components.schemas.RegisterUserRequest,
          },
        },
      },
      responses: {
        201: {
          description: "User created",
          content: {
            "application/json": {
              schema: components.schemas.Response,
            },
          },
        },
        400: {
          description: "Invalid payload",
          content: {
            "application/json": {
              schema: components.schemas.Response,
            },
          },
        },
      },
    },
  },
};
```

```js
// swagger/index.js
import swaggerUi from "swagger-ui-express";
import { userPublicPaths } from "./user/public.js";
import { userPrivatePaths } from "./user/private.js";
import { components } from "./common-schemas.js";

export const swaggerSpec = {
  openapi: "3.0.1",
  info: {
    title: "irtnexus API",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:5001" }],
  paths: {
    ...userPublicPaths,
    ...userPrivatePaths,
  },
  components,
};

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
```

## Guidelines

1. **Folder & File Structure**
   - Each context (user, auth, etc.) has **public & private JS files**
   - Use `common-schemas.js` for reusable objects

2. **Versioning**
   - Include version in paths (`/v1/public/...`)
   - Keep old versions documented but marked deprecated

3. **Schema Reuse**
   - Reuse `components.schemas.Response` for all responses
   - Request body schemas must reference central components

4. **Authentication**
   - Private endpoints must indicate auth requirement via `security` key

5. **Language & Localization**
   - Do not include translated text in Swagger
   - Use English placeholders or translation keys

6. **Validation & CI**
   - Use `swagger-cli validate` or similar JS linter
   - Failing builds on invalid Swagger is mandatory

## Anti-Patterns

- Defining endpoints directly inside controllers
- Hard-coded responses instead of schemas
- Mixing public/private endpoints in the same file
- Omitting version prefixes

## Review Checklist

- All endpoints are documented in JS objects
- Request and response schemas are imported from `common-schemas.js`
- Private endpoints require authentication
- Swagger UI setup works with `/api-docs`
- Versioned paths are maintained

## Summary

Swagger JS setup ensures **documentation stays in sync with code**, is **reusable**, and can be **programmatically validated**.
