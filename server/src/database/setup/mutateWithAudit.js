import { DatabaseFactory } from "#database/setup/DatabaseFactory.js";
import { generateBinaryUUID, logger, bufferToUUID } from "#utils";


/* -------------------------------------------------- */
/* Dynamic Operational DB Resolver                     */
/* -------------------------------------------------- */

function resolveOpDb(table) {
  switch (table) {
    case "users":
      return DatabaseFactory.userOp();
    case "tenants":
      return DatabaseFactory.userAdmin();
    case "emails":
      return DatabaseFactory.userIntegration();
    default:
      return DatabaseFactory.userOp();
  }
}

/* -------------------------------------------------- */
/* Fetch Existing Row (transaction-aware)              */
/* -------------------------------------------------- */

async function fetchExistingRow(conn, { table, idField, idValue }) {
  const [rows] = await conn.execute(
    `SELECT * FROM ${table} WHERE ${idField} = ? LIMIT 1`,
    [idValue],
  );
  return rows?.[0] || null;
}

/* -------------------------------------------------- */
/* Build Only-Changed Diff                             */
/* -------------------------------------------------- */

function buildChangedOnlyDiff(oldRow = {}, newData = {}) {
  const diff = {};
  const changedData = {};

  for (const key of Object.keys(newData)) {
    const oldVal = oldRow?.[key] ?? null;
    const newVal = newData[key] ?? null;

    if (oldVal !== newVal) {
      diff[key] = { old: oldVal, new: newVal };
      changedData[key] = newVal;
    }
  }

  return { diff, changedData };
}

/* -------------------------------------------------- */
/* Generic Mutate With Audit                           */
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
  const opDb = resolveOpDb(table);

  return opDb.transaction(async (conn) => {
    let diff = {};
    let changedData = {};

    /* ================= CREATE ================= */

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

      await conn.execute(
        `INSERT INTO ${table} (${columns.join(", ")})
         VALUES (${placeholders.join(", ")})`,
        [...values, ...Object.values(data)],
      );

      for (const key of Object.keys(data)) {
        diff[key] = { old: null, new: data[key] };
      }
    }

    /* ================= UPDATE ================= */

    if (action === "update") {
      const oldRow = await fetchExistingRow(conn, {
        table,
        idField,
        idValue,
      });

      if (!oldRow) throw new Error("Record not found");

      const result = buildChangedOnlyDiff(oldRow, data);
      diff = result.diff;
      changedData = result.changedData;

      if (Object.keys(changedData).length === 0) {
        return; // nothing changed → no audit row
      }

      const updateClause = Object.keys(changedData)
        .map((col) => `${col} = ?`)
        .join(", ");

      await conn.execute(
        `UPDATE ${table}
         SET ${updateClause}
         WHERE ${idField} = ?`,
        [...Object.values(changedData), idValue],
      );
    }

    /* ================= DELETE / RESTORE ================= */

    if (action === "delete" || action === "restore") {
      const oldRow = await fetchExistingRow(conn, {
        table,
        idField,
        idValue,
      });

      const newValue = action === "delete";

      if (oldRow.is_deleted === newValue) {
        return;
      }

      diff = {
        is_deleted: {
          old: oldRow.is_deleted,
          new: newValue,
        },
      };

      await conn.execute(
        `UPDATE ${table}
         SET is_deleted = ?
         WHERE ${idField} = ?`,
        [newValue, idValue],
      );
    }

    /* -------------------------------------------------- */
    /* Insert Audit Row ONLY if something changed         */
    /* -------------------------------------------------- */

    if (Object.keys(diff).length > 0) {
      await conn.execute(
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
    }

    logger.info(
      `${action.toUpperCase()} audited for ${table} → ${bufferToUUID(idValue)}`,
    );
  });
}
