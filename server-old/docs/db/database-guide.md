# **Database Developer Guide**

This guide outlines the structure, conventions, and best practices for working with the database layer in our project. It is divided into **two main parts**: Setup (one-time configuration) and Runtime Usage (query execution).

---

## **Part 1: Setup**

### **Folder Structure**

All database-related code is organized under the following folders:

```
src/
 ├── database/       # One-time setup scripts
 ├── queries/        # Query execution / repository layer
 ├── config/         # Configuration files (DB passwords, tables, etc.)
```

- **`database/`**
  Contains scripts for one-time setup tasks such as:
  - Creating new database users
  - Creating new tables or schemas
  - Setting user privileges

  **Important:** Developers **should not place runtime queries** here. Only use this folder for setup tasks that are executed during project initialization or migrations.

- **`queries/`**
  Contains code for actual database operations performed during application runtime. Examples include:
  - CRUD operations
  - Reporting queries
  - Transactional operations

  **Important:** Every query must go through the repository layer in this folder. Avoid executing raw queries elsewhere.

- **`config/`**
  Contains configuration files, including:
  - `db.js` → Database connection settings, user passwords, table mappings.

  This ensures:
  - No hardcoding of sensitive credentials in database scripts
  - Centralized management of which tables each user can access

---

### **Database Configuration (`config/db.js`)**

The `db.js` file contains **user credentials and table access mapping**.

#### **Example Structure**

```javascript
export const DB_USER_PASS = {
  AUDIT_PASS: process.env.DB_AUDIT_USER_PASS,
  OP_PASS: process.env.DB_OP_USER_PASS,
  REPORT_PASS: process.env.DB_REPORT_USER_PASS,
  // ...
};

export const DB_TABLES_USER_MAP = {
  AUDIT: ["audit_logs", "security_events"],
  OP: ["users", "auth_credentials", "sessions", ...],
  REPORT: ["*"], // All tables in reporting DB
  BILLING: ["wallets", "invoices", "transactions", "billing_accounts"],
  ADMIN: ["*"],
  INTEGRATION: ["users", "sessions", "transactions", "audit_logs"],
  READONLY_SENS: ["auth_credentials", "user_keys"],
};
```

**Best Practices**

- **Never store passwords directly in code**; always use environment variables.
- Add **new users or tables** here before adding them to database scripts.
- Map tables per user role for **least privilege access**.

---

### **User Management**

We follow a **role-based user system**, each with different privileges:

| User Role            | Purpose / Use Case                     | Allowed Actions / Tables                                            |
| -------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| `audit_user`         | Immutable logging / append-only        | `INSERT` on audit tables                                            |
| `op_user`            | Core operational tasks                 | CRUD (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) on operational tables |
| `report_user`        | Read-heavy reporting                   | `SELECT` on all reporting tables                                    |
| `billing_user`       | Financial transactions                 | `SELECT`, `INSERT`, `UPDATE` on billing tables                      |
| `admin_user`         | Full access (rare, admin tasks)        | CRUD on all tables                                                  |
| `integration_user`   | Service account / integration purposes | `SELECT`, `INSERT`, `UPDATE` on integration tables                  |
| `readonly_sensitive` | Read-only access to sensitive data     | `SELECT` on sensitive tables                                        |

**Key Principle:** **Always use the DatabaseFactory to obtain connections**.

---

### **DatabaseFactory Usage**

`DatabaseFactory.js` provides a **centralized way to get DB connections** per user:

```javascript
import { DatabaseFactory } from "./database/DatabaseFactory.js";

// Example usage:
const db = DatabaseFactory.opUser(); // Get operational DB connection
const reportDb = DatabaseFactory.reportUser(); // Get reporting DB connection
```

**Best Practices**

- Do **not** connect directly using `mysql.createPool` elsewhere.
- Always use the appropriate user for the task:
  - **Read-heavy queries** → `report_user` or `readonly_sensitive`
  - **Transactional writes** → `op_user`
  - **Audit logging** → `audit_user`
  - **Billing** → `billing_user`
  - **Integration tasks** → `integration_user`

- The factory automatically manages:
  - Connection limits per user
  - Lazy initialization of pools
  - Runtime password rotation

---

### **Syncing Users and Privileges**

Use `syncUsers` to **create users and assign privileges** programmatically:

```javascript
import { syncUsers } from "./database/userSync.js";

// Plan mode (dry run)
await syncUsers({ plan: true });

// Actual sync
await syncUsers();
```

- `plan: true` → Logs SQL commands without executing.
- Ensures:
  - User accounts exist
  - Passwords are up-to-date
  - Privileges match configuration

**Best Practices**

- Always validate `user.config.js` before running `syncUsers`.
- Password rotation is handled automatically for users marked `rotatePassword: true`.

---

## **Part 2: Runtime / Query Usage**

### **Folder Structure**

- `queries/` → Repository layer. All runtime database operations **must be implemented here**.
- `database/` → Setup scripts only. **Do not perform runtime queries here.**

---

### **Query Execution Guidelines**

1. **Always get DB connection from `DatabaseFactory`**

   ```javascript
   import { DatabaseFactory } from "#database/DatabaseFactory.js";

   const db = DatabaseFactory.opUser();
   const result = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
   ```

2. **Do not hardcode credentials** in queries.

3. **Use prepared statements** for all queries to prevent SQL injection.

4. **Respect user roles**:
   - `report_user` → read-only reporting
   - `op_user` → operational writes
   - `audit_user` → append-only inserts

5. **Do not bypass `DatabaseFactory`**; it ensures:
   - Connection pooling
   - Proper privilege enforcement
   - Centralized management

---

### **Best Practices Summary**

- **One-time setup** → `database/`
- **Runtime queries** → `queries/`
- **Configuration** → `config/db.js`
- **Use role-based users** via `DatabaseFactory`
- **Never hardcode passwords**
- **Always use plan mode** when making changes to user accounts or privileges in production.
- **Maintain least privilege principle** for security:
  - Only grant users access to the tables they need
  - Limit write access where possible

---

### **Adding New Users or Tables**

1. Update `config/db.js`:
   - Add new user password environment variable
   - Map user role to the relevant tables

2. Update `user.config.js`:
   - Add user object with username, host, privileges, and `rotatePassword` flag

3. Run `syncUsers({ plan: true })` → review SQL statements
4. Run `syncUsers()` → apply changes to the database

---

This documentation ensures **consistency, security, and maintainability** across all database operations for developers.
