
# Example Usage — Users

```js
const userHistory = await getEntityWithHistory({
  table: "users",
  historyTable: "history_users",
  idField: "user_id",
  tenantId: tenantIdBuffer,
  idValue: userIdBuffer,
  order: "DESC",
  limit: 50,
});
```

---

# 🏢 Example Usage — Tenants

```js
const tenantHistory = await getEntityWithHistory({
  table: "tenants",
  historyTable: "history_tenants",
  idField: "tenant_id",
  tenantId: tenantIdBuffer,   // same as id for tenants
  idValue: tenantIdBuffer,
});
```

---

# 🏗 Output Example (Users)

```js
{
  tenant_id: "uuid",
  entity_id: "uuid",
  current: {
    username: "john",
    role: "admin",
    status: "active",
    ...
  },
  history: [
    {
      action: "create",
      changed_by: null,
      timestamp: "...",
      changes: {
        username: { old: null, new: "john" },
        role: { old: null, new: "client" }
      }
    },
    {
      action: "update",
      changed_by: "admin-uuid",
      changes: {
        role: { old: "client", new: "admin" }
      }
    }
  ]
}
```

---

# 🔐 Why This Is Correct for Multi-Tenant SaaS

✔ Tenant filter enforced at DB level
✔ History scoped to tenant
✔ Uses indexed columns `(tenant_id, entity_id, timestamp)`
✔ Pagination supported
✔ Safe against cross-tenant reads
✔ Works for any similar entity

