import { DatabaseFactory } from "#database/setup/DatabaseFactory.js";
import { generateBinaryUUID, logger, bufferToUUID } from "#utils";

/* -------------------------------------------------- */
/* Dynamic Operational DB Resolver                     */
/* -------------------------------------------------- */
/**
 * Resolves the correct database connection based on the table name.
 * Used to dynamically choose between operational, admin, or integration DBs.
 *
 * @param {string} table - The table name to resolve the DB for.
 * @returns {object} Database connection object
 */
function resolveOpDb(table) {
  switch (table) {
    case "users":
      return DatabaseFactory.userOp(); // Operational DB for users
    case "tenants":
      return DatabaseFactory.userAdmin(); // Admin DB for tenants
    case "emails":
      return DatabaseFactory.userIntegration(); // Integration DB for emails
    default:
      return DatabaseFactory.userOp(); // Default to operational DB
  }
}

/* -------------------------------------------------- */
/* Build Only-Changed Diff                             */
/* -------------------------------------------------- */
/**
 * Compares an old row with new data and returns only the changed fields.
 * Useful for creating audit logs and minimizing update payloads.
 *
 * @param {object} oldRow - The existing row from the DB.
 * @param {object} newData - The new data to compare against.
 * @returns {object} - { diff: detailed changes, changedData: just new values }
 */
function buildChangedOnlyDiff(oldRow = {}, newData = {}) {
  const diff = {};
  const changedData = {};

  for (const key of Object.keys(newData)) {
    const oldVal = oldRow?.[key] ?? null;
    const newVal = newData[key] ?? null;

    if (oldVal !== newVal) {
      diff[key] = { old: oldVal, new: newVal }; // Store both old and new for auditing
      changedData[key] = newVal; // Store only new values for update statements
    }
  }

  return { diff, changedData };
}

/* -------------------------------------------------- */
/* Fetch Existing Rows                                 */
/* -------------------------------------------------- */
/**
 * Retrieves existing rows from a table given an array of IDs.
 * Returns a map keyed by the ID field for quick lookup.
 *
 * @param {object} conn - Database connection object.
 * @param {string} table - Table name to query.
 * @param {string} idField - Primary key column name.
 * @param {Array} idValues - Array of IDs to fetch.
 * @returns {object} Map of rows keyed by ID.
 */
async function fetchExistingRows(conn, table, idField, idValues) {
  if (!idValues.length) return {}; // No IDs, return empty map

  const placeholders = idValues.map(() => "?").join(",");
  const [rows] = await conn.execute(
    `SELECT * FROM ${table} WHERE ${idField} IN (${placeholders})`,
    idValues,
  );

  // Convert rows array into an object keyed by ID
  return rows.reduce((acc, row) => {
    acc[row[idField]] = row;
    return acc;
  }, {});
}

/* -------------------------------------------------- */
/* Bulk Mutate With Audit                               */
/* -------------------------------------------------- */
/**
 * Performs bulk create, update, delete, or restore actions with automatic auditing.
 * This function batches operations for efficiency and records all changes in a history table.
 *
 * @param {object} params
 * @param {Array} params.actions - Array of actions: [{ action, idValue, data }]
 * @param {string} params.table - Target table for mutations.
 * @param {string} params.historyTable - Table to store audit logs.
 * @param {string} params.idField - Primary key column name.
 * @param {string|null} params.tenantId - Optional tenant ID for multi-tenant setups.
 * @param {string} params.changedBy - Identifier for the user making changes.
 */
export async function bulkMutateWithAudit(
  {
    actions, // [{ action, idValue, data }]
    table,
    historyTable,
    idField,
    tenantId = null,
    changedBy,
  },
  conn = null,
) {
  if (!actions.length) return; // Nothing to process

  const opDb = resolveOpDb(table); // Get DB connection dynamically

  const executeMutation = async (connection) => {
    const auditRows = [];

    // -------------------- Fetch old rows for update/delete/restore --------------------
    const updateOrDeleteIds = actions
      .filter(
        (a) =>
          a.action === "update" ||
          a.action === "delete" ||
          a.action === "restore",
      )
      .map((a) => a.idValue);

    const oldRows = await fetchExistingRows(
      connection,
      table,
      idField,
      updateOrDeleteIds,
    );

    // -------------------- Bulk Inserts --------------------
    const insertRows = actions.filter((a) => a.action === "create");
    if (insertRows.length > 0) {
      const columns = [
        idField,
        ...(tenantId ? ["tenant_id"] : []),
        ...Object.keys(insertRows[0].data),
        "created_at",
      ];
      const placeholders = insertRows
        .map(() => "(" + columns.map(() => "?").join(",") + ")")
        .join(",");

      const values = insertRows.flatMap((row) => [
        row.idValue,
        ...(tenantId ? [tenantId] : []),
        ...Object.values(row.data),
        // created_at handled by NOW() in DB
      ]);

      // Execute bulk insert
      await connection.execute(
        `INSERT INTO ${table} (${columns.join(",")}) VALUES ${placeholders}`,
        values,
      );

      // Prepare audit log for inserted rows
      for (const row of insertRows) {
        const diff = {};
        for (const key of Object.keys(row.data)) {
          diff[key] = { old: null, new: row.data[key] };
        }
        auditRows.push([
          generateBinaryUUID(),
          tenantId,
          row.idValue,
          JSON.stringify(diff),
          changedBy,
          "create",
        ]);
      }
    }

    // -------------------- Bulk Updates --------------------
    const updateRows = actions.filter((a) => a.action === "update");
    if (updateRows.length > 0) {
      const columnMap = {}; // column => [{ id, value }]

      for (const row of updateRows) {
        const oldRow = oldRows[row.idValue];
        if (!oldRow) throw new Error(`Record not found: ${row.idValue}`);

        const { diff, changedData } = buildChangedOnlyDiff(oldRow, row.data);
        if (!Object.keys(changedData).length) continue; // Skip if nothing changed

        // Organize updates by column for CASE WHEN bulk update
        for (const [col, val] of Object.entries(changedData)) {
          if (!columnMap[col]) columnMap[col] = [];
          columnMap[col].push({ id: row.idValue, value: val });
        }

        auditRows.push([
          generateBinaryUUID(),
          tenantId,
          row.idValue,
          JSON.stringify(diff),
          changedBy,
          "update",
        ]);
      }

      // Build and execute single SQL update for all changed columns
      if (Object.keys(columnMap).length > 0) {
        const setClauses = Object.entries(columnMap)
          .map(([col, updates]) => {
            const cases = updates.map(() => `WHEN ? THEN ?`).join(" ");
            return `${col} = CASE ${idField} ${cases} ELSE ${col} END`;
          })
          .join(", ");

        const allIds = updateRows.map((r) => r.idValue);
        const values = Object.entries(columnMap).flatMap(([_, updates]) =>
          updates.flatMap((u) => [u.id, u.value]),
        );

        await connection.execute(
          `UPDATE ${table} SET ${setClauses} WHERE ${idField} IN (${allIds.map(() => "?").join(",")})`,
          [...values, ...allIds],
        );
      }
    }

    // -------------------- Bulk Delete/Restore --------------------
    const deleteOrRestoreRows = actions.filter(
      (a) => a.action === "delete" || a.action === "restore",
    );
    if (deleteOrRestoreRows.length > 0) {
      const idMap = deleteOrRestoreRows.map((row) => ({
        id: row.idValue,
        value: row.action === "delete" ? 1 : 0, // Set is_deleted flag
      }));

      const ids = idMap.map((i) => i.id);
      await connection.execute(
        `UPDATE ${table} SET is_deleted = CASE ${idField} ${idMap.map(() => "WHEN ? THEN ?").join(" ")} ELSE is_deleted END WHERE ${idField} IN (${ids.map(() => "?").join(",")})`,
        [...idMap.flatMap((i) => [i.id, i.value]), ...ids],
      );

      // Record audit log for delete/restore
      for (const row of deleteOrRestoreRows) {
        const oldVal = oldRows[row.idValue]?.is_deleted ?? 0;
        const newVal = row.action === "delete" ? 1 : 0;
        if (oldVal !== newVal) {
          auditRows.push([
            generateBinaryUUID(),
            tenantId,
            row.idValue,
            JSON.stringify({ is_deleted: { old: oldVal, new: newVal } }),
            changedBy,
            row.action,
          ]);
        }
      }
    }

    // -------------------- Bulk Audit Insert --------------------
    if (auditRows.length > 0) {
      const placeholders = auditRows
        .map(() => "(?, ?, ?, ?, ?, ?, NOW())")
        .join(", ");
      await connection.execute(
        `INSERT INTO ${historyTable} (history_id, tenant_id, ${idField}, changed_columns, changed_by, action_type, timestamp) VALUES ${placeholders}`,
        auditRows.flat(),
      );
    }

    logger.info(`Bulk audited ${actions.length} actions for ${table}`);
  };

  // If connection exists → use it
  if (conn) {
    return executeMutation(conn);
  }

  // Otherwise create new transaction
  return opDb.transaction(executeMutation);
}
