You are generating the **database query layer** for a Node.js API following our company’s architecture. 
All queries must support both normal and transactional execution by accepting a `conn` argument.

1. **Purpose**:
   - Encapsulate all database queries for a specific service/entity
   - Keep queries reusable and consistent
   - Support transactions via a `conn` object if provided

2. **Function signature**:
    ```javascript
    const <functionName> = async (payload, conn) => { ... }
    ```

* `payload`: object containing all input parameters needed for the query (e.g., id, filters, data)
* `conn`: optional database connection object (for transactions)
* Each query should **not** manage transactions itself; transactions are handled by the service layer

3. **Return value**:

   * Always return rows in an array (use the `extractRows(result)` utility if needed)
   * If no rows found, return an empty array
   * Avoid returning raw database result objects directly to the controller

4. **Examples**:

**Insert / Create**

```js
export const insertUser = async (payload, conn) => {
  const { name, email } = payload;
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  const result = await (conn || db).execute(sql, [name, email]);
  return extractRows(result);
};
```

**Select / Read**

```javascript
export const getUserById = async (payload, conn) => {
  const { userId } = payload;
  const sql = `SELECT * FROM users WHERE id = ?`;
  const rows = await (conn || db).execute(sql, [userId]);
  return extractRows(rows);
};
```

**Update**

```javascript
export const updateUserEmail = async (payload, conn) => {
  const { userId, email } = payload;
  const sql = `UPDATE users SET email = ? WHERE id = ?`;
  const result = await (conn || db).execute(sql, [email, userId]);
  return extractRows(result);
};
```

**Delete**

```javascript
export const deleteUser = async (payload, conn) => {
  const { userId } = payload;
  const sql = `DELETE FROM users WHERE id = ?`;
  const [result] = await (conn || db).execute(sql, [userId]);
  return extractRows([result]);
};
```

5. **Guidelines**:

   * Always use parameterized queries (`?`) to prevent SQL injection
   * Support `conn` argument for transaction handling
   * Always return consistent data shape using `extractRows`
   * Keep queries **single-purpose**: one function = one operation
   * Avoid complex business logic in queries; that belongs to the service layer
   * Name functions **intuitively**, following CRUD + entity naming conventions (`insert<Entity>`, `get<Entity>ById`, `update<Entity>Field`, `delete<Entity>`)

6. **Placeholder for prompt engineer**:

   * `<functionName>`: Name of the function (based on operation and entity)
   * `payload` fields: include all required data for the query
   * Table name, columns, and any dynamic filtering

