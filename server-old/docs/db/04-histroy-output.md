
# 🧾 Example Data (Users Table)

Assume we have:

### Current `users` row

```sql
user_id = U1
tenant_id = T1
username = "john"
role = "admin"
status = "active"
```

---

### History Rows

| action  | changed_columns                      |
| ------- | ------------------------------------ |
| create  | username=null→john, role=null→client |
| update  | role=client→admin                    |
| update  | status=active→suspended              |
| restore | status=suspended→active              |

---

---

# 1️⃣ Output of `getEntityTimeline()`

This returns **versioned snapshots** (full state at each step).

```js
{
  tenant_id: "T1-uuid",
  entity_id: "U1-uuid",
  versions: 4,
  timeline: [
    {
      action: "create",
      changed_by: null,
      timestamp: "2026-01-01T10:00:00Z",
      snapshot: {
        username: "john",
        role: "client"
      }
    },
    {
      action: "update",
      changed_by: "admin-uuid",
      timestamp: "2026-01-02T10:00:00Z",
      snapshot: {
        username: "john",
        role: "admin"
      }
    },
    {
      action: "update",
      changed_by: "admin-uuid",
      timestamp: "2026-01-03T10:00:00Z",
      snapshot: {
        username: "john",
        role: "admin",
        status: "suspended"
      }
    },
    {
      action: "restore",
      changed_by: "admin-uuid",
      timestamp: "2026-01-04T10:00:00Z",
      snapshot: {
        username: "john",
        role: "admin",
        status: "active"
      }
    }
  ]
}
```

### 🔎 What this is useful for:

* Version history UI
* Time-travel UI
* “Show changes over time” feature
* Compliance audit review

---

# 2️⃣ Output of `getEntityStateAt()`

Example call:

```js
getEntityStateAt({ atTimestamp: "2026-01-03T12:00:00Z" })
```

### Output:

```js
{
  tenant_id: "T1-uuid",
  entity_id: "U1-uuid",
  at: "2026-01-03T12:00:00Z",
  state: {
    username: "john",
    role: "admin",
    status: "suspended"
  }
}
```

### 🔎 What this is useful for:

* Legal snapshot reconstruction
* “What was the user role last month?”
* Incident investigation
* Financial or compliance audits

---

# 3️⃣ Output of `getTenantAuditFeed()`

This returns **all activity inside a tenant**, not just one user.

```js
[
  {
    history_id: "H4-uuid",
    entity_id: "U1-uuid",
    action: "restore",
    changed_by: "admin-uuid",
    timestamp: "2026-01-04T10:00:00Z",
    changes: {
      status: { old: "suspended", new: "active" }
    }
  },
  {
    history_id: "H3-uuid",
    entity_id: "U1-uuid",
    action: "update",
    changed_by: "admin-uuid",
    timestamp: "2026-01-03T10:00:00Z",
    changes: {
      status: { old: "active", new: "suspended" }
    }
  },
  {
    history_id: "H2-uuid",
    entity_id: "U1-uuid",
    action: "update",
    changed_by: "admin-uuid",
    timestamp: "2026-01-02T10:00:00Z",
    changes: {
      role: { old: "client", new: "admin" }
    }
  }
]
```

### 🔎 What this is useful for:

* Admin dashboard audit log
* Security monitoring
* Tenant-wide activity feed
* SOC2 compliance logging
* Suspicious activity detection

---

# 🧠 Key Difference Between the Three

| Function               | Returns                    | Use Case           |
| ---------------------- | -------------------------- | ------------------ |
| `getEntityTimeline()`  | Full snapshots per version | Versioning UI      |
| `getEntityStateAt()`   | Single reconstructed state | Time-based lookup  |
| `getTenantAuditFeed()` | All tenant changes         | Activity dashboard |

---

# 🚀 Architecturally Speaking

You now have:

* Event log (history table)
* State reconstruction engine
* Versioned entity system
* Tenant-isolated audit feed
* Light event sourcing model

This is **very close to enterprise-grade event sourcing** without full complexity.
