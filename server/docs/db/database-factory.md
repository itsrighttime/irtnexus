# Database Access Developer Guide

This project uses a **factory-based database access layer** built on top of `mysql2/promise`.
The goal is to provide:

- One pooled connection per logical DB user
- Centralized credential and pool management
- Role-based connection limits
- Safe runtime password rotation
- Clean, consistent query APIs

The system is composed of two main parts:

- `DatabaseFactory` – manages and caches database instances
- `Database` – a thin wrapper around a MySQL connection pool

## Architecture Overview

```
┌────────────────────┐
│ user.config.js     │
│  (credentials)     │
└─────────┬──────────┘
          │
┌─────────▼──────────┐
│ DatabaseFactory    │
│  - pool cache      │
│  - user mapping    │
│  - limits          │
└─────────┬──────────┘
          │
┌─────────▼──────────┐
│ Database           │
│  - mysql2 pool     │
│  - query helpers   │
│  - transactions    │
└────────────────────┘
```

Each **logical DB user** (e.g. `report_user`, `op_user`) gets **one shared connection pool** for the lifetime of the process.

## Configuration

### `user.config.js`

Database credentials are sourced from `user.config.js`:

```js
export default {
  users: [
    {
      username: "report_user",
      host: "localhost",
      password: "secret",
      database: "irt-dev",
    },
  ],
};
```

**Required fields per user:**

- `username` – logical identifier used throughout the app
- `host`
- `password`
- `database` (optional, see `guessDatabase()`)

## Using the DatabaseFactory

### Basic Usage

To get a database instance for a user:

```js
import { DatabaseFactory } from "../db/databaseFactory.js";

const db = DatabaseFactory.#getDatabase("report_user");
const rows = await db.query("SELECT * FROM reports");
```

> The factory **caches** instances. Calling `#getDatabase()` multiple times for the same user returns the same pool.

### Convenience Accessors

For common users, the factory exposes helper methods:

```js
const reportDb = DatabaseFactory.userReport();
const auditDb = DatabaseFactory.userAudit();
const adminDb = DatabaseFactory.userAdmin();
```

These are just wrappers around `#getDatabase(username)` and exist for clarity and consistency.

## Query APIs

The `Database` class provides a small, opinionated API.

### `select(query, params)`

For standard SELECT queries:

```js
const users = await db.query("SELECT * FROM users WHERE status = ?", [
  "active",
]);
```

Returns:

- An array of rows

### `execute(query, params)`

For INSERT / UPDATE / DELETE:

```js
const result = await db.execute(
  "UPDATE users SET last_login = NOW() WHERE id = ?",
  [userId],
);

console.log(result.affectedRows);
```

Returns:

- MySQL result object (`affectedRows`, `insertId`, etc.)

### `query(query, params)`

Low-level escape hatch that mirrors `mysql2`’s `pool.query()`:

```js
await db.query("SET SESSION sql_mode = ''");
```

Use sparingly.

## Transactions

Use `transaction()` when multiple queries must succeed or fail together.

```js
await db.transaction(async (conn) => {
  await conn.execute("INSERT INTO orders (user_id) VALUES (?)", [userId]);

  await conn.execute("UPDATE inventory SET stock = stock - 1 WHERE sku = ?", [
    sku,
  ]);
});
```

### Transaction Guarantees

- Automatically begins transaction
- Commits on success
- Rolls back on error
- Always releases the connection

If an error is thrown inside the callback, it will bubble up.

## Connection Pool Behavior

### Pool Size by Role

Connection limits are automatically assigned based on username:

| User Type         | Pool Size |
| ----------------- | --------- |
| Read-heavy users  | 20        |
| Write-heavy users | 10        |
| Default           | 5         |

Defined in:

```js
DatabaseFactory.getConnectionLimit(username);
```

You can adjust this mapping as your workload evolves.

## Database Selection Logic

### Explicit Database

If `database` is defined in `user.config.js`, it is used directly.

### Inferred Database

If omitted, the factory calls:

```js
guessDatabase(username);
```

Default behavior:

```js
return "irt-dev";
```

You can customize this to route specific users to different schemas.

## Runtime Password Rotation

Passwords can be rotated **without restarting the app**.

```js
await DatabaseFactory.rotatePassword("report_user", "newSecret");
```

What happens internally:

1. Updates in-memory config
2. Closes the existing connection pool
3. Creates a new pool on next access

This is useful for:

- Secret rotation
- Emergency credential revocation
- Short-lived credentials

## Graceful Shutdown

If you need to explicitly close a pool:

```js
const db = DatabaseFactory.#getDatabase("report_user");
await db.close();
```

Normally, pools live for the lifetime of the Node.js process.

## Error Handling Guidelines

- `#getDatabase()` throws if the user is not defined
- Query errors bubble up from `mysql2`
- Transaction errors automatically rollback

**Best practice:** handle database errors at the service layer, not inside this abstraction.

## Best Practices

- Use **one DB user per responsibility**
- Prefer `transaction()` for multi-step writes
- Use convenience accessors for clarity
- Do not create pools manually
- Do not share raw connections outside transactions

## Extending the System

Common extensions include:

- Adding new logical users to `user.config.js`
- Custom database routing in `guessDatabase()`
- Metrics / logging around pool usage
- Read-replica support via separate factories
