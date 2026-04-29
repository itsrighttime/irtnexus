# API Design & Usage Guidelines

## 🎯 Purpose

This document defines the **standard structure, naming conventions, and usage patterns** for all APIs in this system.

Goals:

* Consistency across services
* Predictable endpoints
* Minimal duplication
* Strong typing support
* Easy onboarding for developers


# 🧱 1. URL Structure (MANDATORY)

All APIs must follow this structure:

```
{baseUrl}/{version}/{access}/{resource}/{id?}/{sub-resource?}
```

### Example

```
http://localhost:5003/v1/public/forms
http://localhost:5003/v1/private/users/123
http://localhost:5003/v1/private/users/123/orders
```


## 🔒 Fixed Segments

### 1. Base URL

* Environment-based
* Examples:

  * `http://localhost:5003`
  * `https://api.company.com`


### 2. Version

```
/v1
```

* Mandatory
* Enables backward compatibility


### 3. Access Scope

```
/public
/private
```

| Scope   | Description                |
| ------- | -------------------------- |
| public  | No authentication required |
| private | Authentication required    |


# 📦 2. Resource Naming Rules

### ✅ Use:

* Plural nouns → `/users`, `/orders`
* Kebab-case → `/partnership-config`

### ❌ Avoid:

* Verbs → `/getUser`
* camelCase → `/userProfile`
* Deep nesting


# 🔗 3. Nesting Rules

### ✅ Allowed

```
/users/:id/orders
/forms/:id/submissions
```

### ❌ Avoid

```
/users/:id/orders/:orderId/items
```

### ✔ Rule

* Max depth: **2 levels after resource**
* Prefer flattening:

```
/orders/:orderId/items
```


# ⚙️ 4. HTTP Methods (NO action in URL)

| Action     | Method | URL          |
| ---------- | ------ | ------------ |
| Fetch list | GET    | `/users`     |
| Fetch one  | GET    | `/users/:id` |
| Create     | POST   | `/users`     |
| Update     | PATCH  | `/users/:id` |
| Delete     | DELETE | `/users/:id` |


# 🌐 5. Query Parameters (STANDARDIZED)

Use consistent query names across all APIs.


## 🔎 Pagination

```
?page=1
&limit=20
```


## 🔍 Search

```
?filter=keyword
```


## 🎯 Filtering

```
?status=active&type=online
```


## ↕️ Sorting

```
?sortBy=createdAt&sortOrder=desc
```


## 📅 Date Range

```
?from=2025-01-01&to=2025-01-31
```


## 📦 Include Relations

```
?include=orders,profile
```


## 🔢 Field Selection

```
?fields=id,name,email
```


## ❌ Avoid

```
?q=abc
?searchTerm=abc
?data={...}
```


# 🧠 6. API Schema (Single Source of Truth)

All endpoints must be defined in a centralized schema:

```ts
export const API_SCHEMA = {
  version: "v1",
  access: {
    public: "public",
    private: "private",
  },
  resources: {
    users: {
      path: "users",
      hasId: true,
      subResources: {
        orders: "orders",
        profile: "profile",
      },
    },
  },
} as const;
```


## 🔑 Rules

* Never hardcode paths outside schema
* Add new resources ONLY here
* Types are auto-derived from schema


# 🏗️ 7. URL Builder Usage

Always use the `buildURL` function.


## ✅ Example

```ts
buildURL({
  access: "public",
  resource: "forms",
});
```


## ✅ With ID

```ts
buildURL({
  access: "private",
  resource: "users",
  id: 123,
});
```


## ✅ With Sub-resource

```ts
buildURL({
  access: "private",
  resource: "users",
  id: 123,
  subResource: "orders",
});
```


## ✅ With Query

```ts
buildURL({
  access: "private",
  resource: "users",
  query: {
    page: 1,
    limit: 20,
    sortBy: "createdAt",
  },
});
```


## ❌ Never do this

```ts
// ❌ Forbidden
const url = "/v1/private/users/123";
```


# ➕ 8. Adding New APIs

### Step 1: Update Schema

```ts
products: {
  path: "products",
  hasId: true,
}
```


### Step 2: Use Builder

```ts
buildURL({
  access: "private",
  resource: "products",
});
```


### ❗ Do NOT:

* Hardcode URLs
* Create custom query names
* Break naming conventions


# ⚠️ 9. Error Handling Rules

* Invalid `id` → throw error
* Invalid `subResource` → throw error
* Missing required segments → fail fast


# 🚀 10. Best Practices

### ✅ Do:

* Keep endpoints predictable
* Reuse query params
* Use schema as single source
* Keep nesting shallow


### ❌ Don’t:

* Invent new patterns
* Duplicate paths
* Use inconsistent naming
* Add actions in URLs


# 🎯 Final Principle

> If a developer cannot guess the endpoint without documentation, the API design is wrong.


# 🏁 Summary

* Standard URL structure enforced
* Central schema controls everything
* Query params standardized
* Builder ensures zero duplication
* Strong typing ensures safety
