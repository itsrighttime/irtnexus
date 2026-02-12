import { DatabaseFactory } from "#database/setup/DatabaseFactory.js";
import { generateBinaryUUID, logger, bufferToUUID } from "#utils";

const opUser = DatabaseFactory.userOp();
const auditUser = DatabaseFactory.userAudit();

function buildInsertAuditPayload(data) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      { old: null, new: value },
    ]),
  );
}

export async function insertWithAudit({
  table,
  historyTable,
  idField,
  idValue,
  tenantId = null,
  data,
  changedBy = "system_seed",
}) {
  const columns = Object.keys(data);

  /* -------------------------------------------------- */
  /* Build dynamic columns safely                       */
  /* -------------------------------------------------- */

  const mainColumns = [idField];
  const mainValues = [idValue];

  if (tenantId !== null) {
    mainColumns.push("tenant_id");
    mainValues.push(tenantId);
  }

  mainColumns.push(...columns, "created_at");

  const placeholders = [
    ...mainValues.map(() => "?"),
    ...columns.map(() => "?"),
    "NOW()",
  ];

  const sql = `
    INSERT INTO ${table} (${mainColumns.join(", ")})
    VALUES (${placeholders.join(", ")})
  `;

  await opUser.execute(sql, [...mainValues, ...columns.map((c) => data[c])]);

  /* -------------------------------------------------- */
  /* Audit Insert                                       */
  /* -------------------------------------------------- */

  const auditColumns = ["history_id", idField];
  const auditValues = [generateBinaryUUID(), idValue];

  if (tenantId !== null) {
    auditColumns.push("tenant_id");
    auditValues.push(tenantId);
  }

  auditColumns.push("changed_columns", "changed_by", "timestamp");

  const auditPlaceholders = [...auditValues.map(() => "?"), "?", "?", "NOW()"];

  const auditSql = `
    INSERT INTO ${historyTable} (${auditColumns.join(", ")})
    VALUES (${auditPlaceholders.join(", ")})
  `;

  await auditUser.execute(auditSql, [
    ...auditValues,
    JSON.stringify(buildInsertAuditPayload(data)),
    changedBy,
  ]);

  logger.info(
    `Inserted into ${table} with audit trail in ${historyTable} for ID ${bufferToUUID(idValue)}`,
  );
}
