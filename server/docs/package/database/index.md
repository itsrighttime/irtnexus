# Developer Guide – IRT PostgreSQL Module

This guide explains how to use the PostgreSQL database module safely and effectively. The module enforces **tenant isolation**, **soft-delete**, and **versioning**, while providing flexible transaction support.

## 1. Setup & Imports

```ts
import {
  BaseRepository,
  BaseRepositoryOptions,
  QuerySecurityEngine,
  withTransaction,
} from "@irt/database";

interface Project {
  id: number;
  name: string;
  status: string;
}
```

- **`BaseRepository`** → For CRUD operations with versioning.
- **`QuerySecurityEngine`** → Optional, for raw read-only queries with tenant enforcement.
- **`withTransaction`** → For grouping multiple operations in a single transaction.

## 2. Initialize a Repository

```ts
const projectRepo = new BaseRepository<Project>({
  tableName: "projects",
  versionTableName: "projects_version",
  asyncVersioning: false, // default, can be set to true for high-throughput
  asyncWrites: false, // default, can be set to true for high-throughput
});
```

- All operations automatically handle **tenant_id** and **deleted_at** constraints.
- Version entries are stored in `projects_version`.

## 3. Request Context

All operations require a `RequestContext`:

```ts
interface RequestContext {
  userId: string;
  tenantId: string;
}
```

Example:

```ts
const ctx: RequestContext = {
  userId: "user_123",
  tenantId: "tenant_abc",
};
```

## 4. Create a Record

```ts
const project = await projectRepo.create(
  { name: "Alpha Project", status: "OPEN" },
  ctx,
);

console.log("Created Project:", project);
```

- **Tenant enforcement** and **versioning** happen automatically.
- Logs will include transaction start, SQL execution, and version entry creation.

## 5. Update a Record

```ts
const updatedProject = await projectRepo.update(
  project.id,
  { status: "ACTIVE" },
  ctx,
);

console.log("Updated Project:", updatedProject);
```

- Only records with `is_deleted = FALSE` are updated.
- Versioning tracks the change.

## 6. Soft Delete

```ts
await projectRepo.delete(project.id, ctx);
```

- Marks record as `is_deleted = TRUE`.
- `deleted_at` and `deleted_by` are automatically set.
- Version entry records the deleted state.

## 7. Find a Record by ID

```ts
const projectData = await projectRepo.findById(project.id);
console.log("Fetched Project:", projectData);
```

- Automatically filters out soft-deleted records.
- No tenant parameter is required; the repository enforces it internally.

## 8. Raw SELECT Queries (Read-only)

```ts
const sql = `
  SELECT p.id, p.name, c.name as client_name
  FROM projects p
  JOIN clients c ON c.id = p.client_id
`;

const rows = await projectRepo.select(sql, [], ctx);

console.log("Projects with Clients:", rows);
```

- **Tenant filters** and **soft-delete filters** are automatically injected.
- Attempting `INSERT`, `UPDATE`, or `DELETE` in `select()` will throw an error.

Optional direct use of `QuerySecurityEngine`:

```ts
import { QuerySecurityEngine } from "@irt/database";

const safeQuery = QuerySecurityEngine.rewrite(sql, ctx, []);
```

## 9. Transactions with `withTransaction`

Use `withTransaction` to perform multiple operations in a single DB transaction:

```ts
await withTransaction(async (tx) => {
  const project = await projectRepo.create(
    { name: "Mega Project", status: "OPEN" },
    ctx,
    tx,
  );

  await projectRepo.update(project.id, { status: "ACTIVE" }, ctx, tx);
});
```

- If any operation fails, all changes are rolled back.
- Pass the `tx` client to repository methods for the transaction scope.

## 10. Async Versioning

```ts
const projectRepoAsync = new BaseRepository<Project>({
  tableName: "projects",
  versionTableName: "projects_version",
  asyncVersioning: true,
});

await projectRepoAsync.update(project.id, { status: "COMPLETED" }, ctx);
```

- Version entries are queued asynchronously in `versionQueue`.
- Improves throughput for high-frequency operations.

## 11. Developer Notes

1. **Tenant Enforcement:**
   All repository methods and `select()` queries automatically enforce `tenant_id` and `deleted_at`.

2. **Logging:**
   The module logs key events at various levels:
   - `debug` → Transaction start, client acquisition, SQL execution
   - `info` → Successful CRUD
   - `warn` → Soft deletes
   - `error` → Failures / rollbacks

3. **Safety:**
   - Use `select()` only for read-only queries.
   - All mutation operations should go through repository methods for versioning.

4. **Global Tables:**
   - Tables without tenant-specific data should be excluded from `QuerySecurityEngine`.
   - For joins, tenant filters apply to each table in the query that has `tenant_id`.

This guide ensures that developers can **safely create, read, update, delete, and query** while respecting tenants, versioning, and soft deletes.
