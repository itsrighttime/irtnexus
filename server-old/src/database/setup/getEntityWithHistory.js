import { DatabaseFactory } from "#database/setup/DatabaseFactory.js";
import { bufferToUUID } from "#utils";

/* -------------------------------------------------- */
/* Multi-Tenant Entity With History                    */
/* -------------------------------------------------- */

export async function getEntityWithHistory(
  {
    table,
    historyTable,
    idField,
    tenantId,
    idValue,
    order = "ASC", // ASC = oldest first
    limit = 100, // pagination support
    offset = 0,
  },
  conn = null,
) {
  const db = conn ?? DatabaseFactory.userReport(); // read-only user

  /* -------------------- Fetch Current -------------------- */

  const currentRows = await db.select(
    `SELECT *
     FROM ${table}
     WHERE tenant_id = ? AND ${idField} = ?
     LIMIT 1`,
    [tenantId, idValue],
  );

  const current = currentRows[0];

  if (!current) {
    throw new Error("Record not found or tenant mismatch");
  }

  /* -------------------- Fetch History -------------------- */

  const historyRows = await db.select(
    `SELECT history_id,
            changed_columns,
            changed_by,
            action_type,
            timestamp
     FROM ${historyTable}
     WHERE tenant_id = ?
       AND ${idField} = ?
     ORDER BY timestamp ${order}
     LIMIT ? OFFSET ?`,
    [tenantId, idValue, limit, offset],
  );

  /* -------------------- Format Output -------------------- */

  const history = historyRows.map((row) => ({
    history_id: bufferToUUID(row.history_id),
    action: row.action_type,
    changed_by: row.changed_by ? bufferToUUID(row.changed_by) : null,
    timestamp: row.timestamp,
    changes:
      typeof row.changed_columns === "string"
        ? JSON.parse(row.changed_columns)
        : row.changed_columns,
  }));

  return {
    tenant_id: bufferToUUID(tenantId),
    entity_id: bufferToUUID(idValue),
    current,
    history,
  };
}
