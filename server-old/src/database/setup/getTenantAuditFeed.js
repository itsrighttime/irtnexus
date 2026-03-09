import { bufferToUUID } from "#utils";
import { DatabaseFactory } from "./DatabaseFactory.js";

export async function getTenantAuditFeed(
  { historyTable, idField, tenantId, limit = 100, offset = 0, order = "DESC" },
  conn = null,
) {
  const db = conn ?? DatabaseFactory.userReport();

  const rows = await db.select(
    `SELECT history_id,
            ${idField} AS entity_id,
            changed_columns,
            changed_by,
            action_type,
            timestamp
     FROM ${historyTable}
     WHERE tenant_id = ?
     ORDER BY timestamp ${order}
     LIMIT ? OFFSET ?`,
    [tenantId, limit, offset],
  );

  return rows.map((row) => ({
    history_id: bufferToUUID(row.history_id),
    entity_id: bufferToUUID(row.entity_id),
    action: row.action_type,
    changed_by: row.changed_by ? bufferToUUID(row.changed_by) : null,
    timestamp: row.timestamp,
    changes:
      typeof row.changed_columns === "string"
        ? JSON.parse(row.changed_columns)
        : row.changed_columns,
  }));
}
