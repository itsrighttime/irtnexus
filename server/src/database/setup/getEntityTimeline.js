import { DatabaseFactory } from "#database/setup/DatabaseFactory.js";
import { bufferToUUID } from "#utils";

export async function getEntityTimeline({
  table,
  historyTable,
  idField,
  tenantId,
  idValue,
}) {
  const db = DatabaseFactory.userReport();

  // Fetch history in chronological order
  const historyRows = await db.select(
    `SELECT changed_columns, action_type, changed_by, timestamp
     FROM ${historyTable}
     WHERE tenant_id = ?
       AND ${idField} = ?
     ORDER BY timestamp ASC`,
    [tenantId, idValue],
  );

  let currentState = {};
  const timeline = [];

  for (const row of historyRows) {
    const changes =
      typeof row.changed_columns === "string"
        ? JSON.parse(row.changed_columns)
        : row.changed_columns;

    // Apply diff
    for (const [key, value] of Object.entries(changes)) {
      currentState[key] = value.new;
    }

    timeline.push({
      action: row.action_type,
      changed_by: row.changed_by ? bufferToUUID(row.changed_by) : null,
      timestamp: row.timestamp,
      snapshot: { ...currentState }, // clone snapshot
    });
  }

  return {
    tenant_id: bufferToUUID(tenantId),
    entity_id: bufferToUUID(idValue),
    versions: timeline.length,
    timeline,
  };
}
