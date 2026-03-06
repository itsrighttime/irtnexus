# API Versioning Guidelines

## Purpose

API versioning ensures that **changes in the API do not break existing clients** while allowing new features, improvements, or bug fixes.

Goals:

- Maintain backward compatibility
- Allow smooth migration for consumers
- Enable parallel development of multiple API versions
- Clearly communicate API lifecycle (active, deprecated, removed)

## Core Principles

1. **Semantic Versioning by Path**
   - Use the path prefix to denote API version:

     ```
     /v1/public/users
     /v2/private/auth
     ```

   - Major version changes (`v1` → `v2`) indicate **breaking changes**
   - Minor updates (within the same major version) should **not break existing clients**

2. **Versioned Endpoints**
   - Every public and private endpoint must include a version prefix
   - Example:

     ```js
     app.use("/v1/public", publicRoutes);
     app.use("/v2/private", privateRoutesV2);
     ```

3. **Maintain Multiple Versions**
   - Keep older versions active until clients have migrated
   - Do not remove versions without **prior communication and migration plan**

## Versioning Strategy

### 1. Major Versions

- **v1, v2, v3…**
- Increment only on **breaking changes**, e.g.:
  - Changing request or response schema
  - Removing or renaming endpoints
  - Modifying behavior of existing endpoints

### 2. Minor Updates / Patches

- Can include **new endpoints or optional fields**
- Must be backward compatible
- Do not increment the major version

### 3. Deprecation Policy

- Mark endpoints deprecated before removal
- Return a **warning header**:

  ```
  Warning: 299 - This API endpoint is deprecated. Please migrate to /v2/...
  ```

- Maintain deprecated endpoints for **at least one release cycle**

## Folder & Code Structure

Organize routes and controllers **by version**:

```
/routes
  ├─ v1/
  │    ├─ public/
  │    │    ├─ user.route.js
  │    │    └─ auth.route.js
  │    └─ private/
  │         └─ ...
  └─ v2/
       ├─ public/
       └─ private/
```

- Keep **v1, v2, v3 separated**
- Controllers, validators, and services should also be **version-specific if behavior changes**
- Shared logic (utility functions, common services) can be reused

## Versioning in Swagger / Documentation

- Maintain **separate Swagger objects** per version:

```js
import { userV1PublicPaths } from "./user/v1/public.js";
import { userV2PublicPaths } from "./user/v2/public.js";

export const swaggerSpecV1 = {
  openapi: "3.0.1",
  info: { title: "irtnexus API v1", version: "1.0.0" },
  paths: { ...userV1PublicPaths },
};

export const swaggerSpecV2 = {
  openapi: "3.0.1",
  info: { title: "irtnexus API v2", version: "2.0.0" },
  paths: { ...userV2PublicPaths },
};
```

- Document changes clearly between versions
- Mark deprecated endpoints with `deprecated: true`

## Request & Response Versioning Considerations

1. **Request Changes**
   - New optional fields → minor version
   - Removed/renamed required fields → major version

2. **Response Changes**
   - Adding new fields → minor version (safe)
   - Changing existing fields → major version (breaking)

3. **Headers for Version Awareness (Optional)**
   - Can support `Accept` header versioning if path-based versioning is insufficient:

     ```
     Accept: application/vnd.irtnexus.v1+json
     ```

## Deprecation & Removal Strategy

1. **Deprecation**
   - Add warning in response headers
   - Update documentation
   - Notify consumers internally and externally

2. **Removal**
   - Only after sufficient deprecation period
   - Maintain migration guides and support for old clients during transition

## Anti-Patterns (Strictly Forbidden)

- Changing existing endpoints without a version bump
- Removing fields silently without warning
- Mixing different versions in the same route file
- Hardcoding version logic in controllers or services

## Review Checklist

- All endpoints have version prefix (`/v1`, `/v2`, etc.)
- Major changes increment the version
- Deprecated endpoints have clear warnings
- Documentation for all versions is maintained
- Shared logic reused, not duplicated

## Summary

API versioning is critical to **stability, backward compatibility, and client trust**.

By following this approach:

- Developers can innovate without breaking existing clients
- Clients can migrate safely between versions
- Documentation remains accurate and versioned
