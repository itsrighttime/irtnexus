import { DatabaseFactory } from "#database";
import { generateBinaryUUID, logger, bufferToUUID } from "#utils";

const opDb = DatabaseFactory.userOp();
const auditDb = DatabaseFactory.userAudit();

/* -------------------------------------------------- */
/* Helpers                                            */
/* -------------------------------------------------- */

function buildDiffPayload(oldRow = {}, newRow = {}) {
  const diff = {};

  const allKeys = new Set([
    ...Object.keys(oldRow || {}),
    ...Object.keys(newRow || {}),
  ]);

  for (const key of allKeys) {
    const oldVal = oldRow?.[key] ?? null;
    const newVal = newRow?.[key] ?? null;

    if (oldVal !== newVal) {
      diff[key] = { old: oldVal, new: newVal };
    }
  }

  return diff;
}

async function fetchExistingRow({ table, idField, idValue }) {
  const [rows] = await opDb.execute(
    `SELECT * FROM ${table} WHERE ${idField} = ? LIMIT 1`,
    [idValue],
  );
  return rows?.[0] || null;
}

/* -------------------------------------------------- */
/* Main Generic Function                              */
/* -------------------------------------------------- */

export async function mutateWithAudit({
  action, // create | update | delete | restore
  table,
  historyTable,
  idField,
  idValue,
  tenantId = null,
  data = {},
  changedBy,
}) {
  const connection = await opDb.getConnection();

  try {
    await connection.beginTransaction();

    let oldRow = null;
    let newRow = null;

    /* -------------------------------------------------- */
    /* CREATE                                              */
    /* -------------------------------------------------- */
    if (action === "create") {
      const columns = [idField];
      const values = [idValue];

      if (tenantId) {
        columns.push("tenant_id");
        values.push(tenantId);
      }

      columns.push(...Object.keys(data), "created_at");

      const placeholders = [
        ...values.map(() => "?"),
        ...Object.keys(data).map(() => "?"),
        "NOW()",
      ];

      await connection.execute(
        `INSERT INTO ${table} (${columns.join(", ")})
         VALUES (${placeholders.join(", ")})`,
        [...values, ...Object.values(data)],
      );

      newRow = data;
    }

    /* -------------------------------------------------- */
    /* UPDATE                                              */
    /* -------------------------------------------------- */
    if (action === "update") {
      oldRow = await fetchExistingRow({ table, idField, idValue });

      const updates = Object.keys(data)
        .map((col) => `${col} = ?`)
        .join(", ");

      await connection.execute(
        `UPDATE ${table}
         SET ${updates}
         WHERE ${idField} = ?`,
        [...Object.values(data), idValue],
      );

      newRow = { ...oldRow, ...data };
    }

    /* -------------------------------------------------- */
    /* DELETE (Soft delete)                                */
    /* -------------------------------------------------- */
    if (action === "delete") {
      oldRow = await fetchExistingRow({ table, idField, idValue });

      await connection.execute(
        `UPDATE ${table}
         SET is_deleted = TRUE
         WHERE ${idField} = ?`,
        [idValue],
      );

      newRow = { ...oldRow, is_deleted: true };
    }

    /* -------------------------------------------------- */
    /* RESTORE                                             */
    /* -------------------------------------------------- */
    if (action === "restore") {
      oldRow = await fetchExistingRow({ table, idField, idValue });

      await connection.execute(
        `UPDATE ${table}
         SET is_deleted = FALSE
         WHERE ${idField} = ?`,
        [idValue],
      );

      newRow = { ...oldRow, is_deleted: false };
    }

    /* -------------------------------------------------- */
    /* Build Audit Payload                                 */
    /* -------------------------------------------------- */

    const diff =
      action === "create"
        ? buildDiffPayload({}, newRow)
        : buildDiffPayload(oldRow, newRow);

    await auditDb.execute(
      `INSERT INTO ${historyTable}
       (history_id, tenant_id, ${idField},
        changed_columns, changed_by, action_type, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        generateBinaryUUID(),
        tenantId,
        idValue,
        JSON.stringify(diff),
        changedBy,
        action,
      ],
    );

    await connection.commit();

    logger.info(
      `${action.toUpperCase()} on ${table} audited for ID ${bufferToUUID(idValue)}`,
    );
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}
