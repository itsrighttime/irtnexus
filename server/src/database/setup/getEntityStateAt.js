import { DatabaseFactory } from "./DatabaseFactory.js";

export async function getEntityStateAt(
  { historyTable, idField, tenantId, idValue, atTimestamp },
  conn = null,
) {
  const db = conn ?? DatabaseFactory.userReport();

  const historyRows = await db.select(
    `SELECT changed_columns
     FROM ${historyTable}
     WHERE tenant_id = ?
       AND ${idField} = ?
       AND timestamp <= ?
     ORDER BY timestamp ASC`,
    [tenantId, idValue, atTimestamp],
  );

  let state = {};

  for (const row of historyRows) {
    const changes =
      typeof row.changed_columns === "string"
        ? JSON.parse(row.changed_columns)
        : row.changed_columns;

    for (const [key, value] of Object.entries(changes)) {
      state[key] = value.new;
    }
  }

  return {
    tenant_id: bufferToUUID(tenantId),
    entity_id: bufferToUUID(idValue),
    at: atTimestamp,
    state,
  };
}
