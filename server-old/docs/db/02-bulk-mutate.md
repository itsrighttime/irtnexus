Sure! Here’s an example of how you could call `bulkMutateWithAudit`. I’ll include **create, update, delete, and restore actions** in a single batch so you can see the full usage:

```javascript
import { bulkMutateWithAudit } from "./path/to/your/module.js";

async function runExample() {
  await bulkMutateWithAudit({
    table: "users",            // Target table
    historyTable: "users_history", // Audit/history table
    idField: "user_id",        // Primary key column
    tenantId: "tenant_123",    // Optional multi-tenant ID
    changedBy: "admin_user",   // Who is performing the changes
    actions: [
      // -------------------- Create new user --------------------
      {
        action: "create",
        idValue: "user_101",
        data: {
          name: "Alice",
          email: "alice@example.com",
          role: "editor",
        },
      },
      // -------------------- Update existing user --------------------
      {
        action: "update",
        idValue: "user_42",
        data: {
          name: "Bob Updated",
          role: "admin",
        },
      },
      // -------------------- Soft delete a user --------------------
      {
        action: "delete",
        idValue: "user_33",
      },
      // -------------------- Restore a previously deleted user --------------------
      {
        action: "restore",
        idValue: "user_21",
      },
    ],
  });

  console.log("Bulk operation completed with audit logging.");
}

// Execute the example
runExample().catch((err) => console.error("Error during bulk operation:", err));
```


If you only want to **bulk insert multiple rows** (no updates, deletes, or restores), the `bulkMutateWithAudit` function can handle it easily. You just provide an array of `create` actions. Here's a concrete example:

```javascript
import { bulkMutateWithAudit } from "./path/to/your/module.js";

async function bulkInsertExample() {
  // Prepare multiple "create" actions
  const createActions = [
    {
      action: "create",
      idValue: "user_201",
      data: { name: "Charlie", email: "charlie@example.com", role: "viewer" },
    },
    {
      action: "create",
      idValue: "user_202",
      data: { name: "Diana", email: "diana@example.com", role: "editor" },
    },
    {
      action: "create",
      idValue: "user_203",
      data: { name: "Eve", email: "eve@example.com", role: "admin" },
    },
  ];

  await bulkMutateWithAudit({
    table: "users",             // Target table
    historyTable: "users_history", // Audit/history table
    idField: "user_id",         // Primary key column
    tenantId: "tenant_123",     // Optional tenant ID
    changedBy: "system_import", // Who performed the bulk insert
    actions: createActions,     // Only create actions
  });

  console.log("Bulk insert completed with audit logs for all new rows.");
}

// Execute the bulk insert example
bulkInsertExample().catch((err) =>
  console.error("Error during bulk insert:", err)
);
```



### ✅ Notes on the example:

1. **`create`** actions must include `data` for the new row.
2. **`update`** actions include only the fields that might change. The function automatically computes the diff and ignores unchanged fields.
3. **`delete`** and **`restore`** are soft operations (assumes an `is_deleted` column). Audit logs will capture the old vs new state.
4. `tenantId` is optional; if your table isn’t multi-tenant, it can be omitted.
5. All actions are processed **in a single transaction**, so either everything succeeds or nothing is written.
