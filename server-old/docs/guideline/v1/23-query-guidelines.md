# **Query & Database Guidelines (Final Version)**

## **Purpose**

These guidelines define **how database access should be written, organized, and consumed**.

The goal is to:

- Provide **predictable, safe, and auditable data access**
- Enforce **role-based access and least privilege**
- Ensure **transactions are handled consistently**

**Key Principle:** Queries are the **hands** of the system—they fetch, persist, and update data. They **never decide outcomes or enforce business rules**.

## **1. Database Connection Management**

### **Use `DatabaseFactory` for all DB instances**

All database connections **must be created via `DatabaseFactory`**.
Developers **must not** create connections manually using `mysql2.createPool` or similar APIs.

**Example:**

```javascript
import { DatabaseFactory } from "#database";

const opDb = DatabaseFactory.userOp(); // Operational DB
const reportDb = DatabaseFactory.userReport(); // Reporting DB
const auditDb = DatabaseFactory.userAudit(); // Audit logging
```

**Why:**

- Ensures **single pooled connection per logical user**
- Centralizes **credentials, connection limits, and password rotation**
- Prevents **unauthorized direct access** to the database
- Provides **runtime password rotation** support

### **`DatabaseFactory` Overview**

| **Function / Accessor**   | **Type**        | **Purpose**                                                           | **Usage Example**                                     |
| ------------------------- | --------------- | --------------------------------------------------------------------- | ----------------------------------------------------- |
| `userReport()`            | Static accessor | Convenience method to get the `report_user` database instance.        | `const reportDb = DatabaseFactory.userReport();`      |
| `userReadonlySensitive()` | Static accessor | Convenience method to get the `readonly_sensitive` database instance. | `const db = DatabaseFactory.userReadonlySensitive();` |
| `userOp()`                | Static accessor | Convenience method to get the `op_user` database instance.            | `const opDb = DatabaseFactory.userOp();`              |
| `userIntegration()`       | Static accessor | Convenience method to get the `integration_user` database instance.   | `const db = DatabaseFactory.userIntegration();`       |
| `userBilling()`           | Static accessor | Convenience method to get the `billing_user` database instance.       | `const db = DatabaseFactory.userBilling();`           |
| `userAudit()`             | Static accessor | Convenience method to get the `audit_user` database instance.         | `const db = DatabaseFactory.userAudit();`             |
| `userAdmin()`             | Static accessor | Convenience method to get the `admin_user` database instance.         | `const db = DatabaseFactory.userAdmin();`             |
| `userDev()`               | Static accessor | Convenience method to get the `dev_user` database instance.           | `const db = DatabaseFactory.userDev();`               |

**Key Points:**

1. **Lazy Initialization:** Pools are created only when first accessed.
2. **Per-User Caching:** One pool per logical user per process.
3. **Role-Based Limits:** Pools sized automatically based on read/write workload.
4. **Runtime Password Rotation:** Call `rotatePassword()` to update credentials without restarting the app.
5. **Convenience Accessors:** Helper methods like `userReport()` or `userOp()` improve clarity and prevent misuse.

## **2. Query Layer Responsibilities**

Queries are **atomic operations** on the database.

### **Allowed Responsibilities**

- Execute SQL statements
- Return raw or minimally shaped results
- Accept a database connection (transaction-aware)
- Be composable inside service-managed transactions

### **Forbidden Responsibilities**

- Validation or authorization
- Business logic or state inference
- Transaction management (`begin`, `commit`, `rollback`)
- Error translation

**Example query pattern:**

```javascript
export const getUserByEmail = async (email, conn = null) => {
  const db = conn ?? DatabaseFactory.userOp();
  return db.execute("SELECT id, username, email FROM users WHERE email = ?", [
    email,
  ]);
};
```

## **3. Transaction Ownership**

- Transactions are **always owned by services**, not queries.
- Queries must remain **transaction-agnostic**.

**Example service managing a transaction:**

```javascript
await DatabaseFactory.userOp().transaction(async (conn) => {
  await createUser(userData, conn);
  await logAudit(userData.id, conn);
});
```

**Forbidden inside queries:**

```javascript
await conn.beginTransaction(); // ❌
await conn.commit(); // ❌
await conn.rollback(); // ❌
```

## **4. SQL Rules**

**Allowed:**

- Parameterized SQL statements
- Explicit column selection
- Clear `WHERE` clauses
- Deterministic ordering (`ORDER BY`)

**Forbidden:**

- `SELECT *`
- String interpolation or dynamic SQL
- Hidden joins or implicit table relationships

**Principle:** SQL must be **readable, deterministic, and auditable**.

## **5. Error Handling**

- Let database errors bubble up to the service layer
- Queries should **not** catch or translate errors unless strictly required
- Constraint violations (duplicate keys, foreign keys, etc.) are handled at the **service layer**

## **6. Read vs Write Separation**

- **Read queries**: must never mutate data
- **Write queries**: explicit `INSERT`, `UPDATE`, `DELETE` only
- Mixed read/write queries are forbidden

**Soft delete & flags:** Always respect `is_deleted`, `status`, and visibility filters.

## **7. Multi-Database Systems**

- Each query module targets **only one database**
- Database selection must be **explicit**
- Cross-database joins are forbidden

## **8. Performance Guidelines**

- Use indexed columns for filters
- Limit result sets where possible
- Avoid unnecessary joins
- Performance optimizations belong in queries, not services

## **9. Testing Expectations**

- Queries must be tested for:
  - Valid inputs
  - Boundary conditions
  - Empty result sets
  - Constraint violations

**Testing principle:** Prefer real SQL against a **test database**.

## **10. Anti-Patterns (Strictly Forbidden)**

- Business logic in queries
- Conditional branching in queries
- Query chaining inside queries
- Using queries as services

## **11. Review Checklist**

Ensure each query:

- Is **parameterized**
- Contains **no transactions**
- Has **no business rules**
- Uses **DatabaseFactory** for connections
- Is **named clearly** reflecting intent

## **12. Summary**

- **All DB instances must come from `DatabaseFactory`.**
- Queries are **the hands**, services are **the brain**.
- Maintain **least privilege** and **role-based access**.
- Keep queries **deterministic, auditable, and composable**.
