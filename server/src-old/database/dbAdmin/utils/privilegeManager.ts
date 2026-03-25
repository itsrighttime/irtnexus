import { pgPool } from "#database/config/postgres.pool.js";
import { logger } from "#utils";

export async function syncPrivileges(
  user: {
    username: string;
    privileges: {
      db: string;
      tables?: string[];
      actions: string[];
    }[];
  },
  plan = false,
) {
  if (!user.privileges?.length) return;

  const client = await pgPool.connect();

  try {
    const res = await client.query(
      `
      SELECT table_name, privilege_type
      FROM information_schema.role_table_grants
      WHERE grantee = $1
      `,
      [user.username],
    );

    const existing = new Set(
      res.rows.map((r) => `${r.privilege_type} ON ${r.table_name}`),
    );

    for (const p of user.privileges) {
      const tables = p.tables ?? ["*"];
      const actions = p.actions;

      for (const table of tables) {
        for (const action of actions) {
          const expected = `${action} ON ${table}`;

          if (!existing.has(expected)) {
            const sql =
              table === "*"
                ? `GRANT ${action} ON ALL TABLES IN SCHEMA public TO "${user.username}"`
                : `GRANT ${action} ON TABLE ${table} TO "${user.username}"`;

            if (plan) {
              logger.info(`[PLAN] ${sql}`);
            } else {
              await client.query(sql);
              logger.info(`Granted ${action} on ${table} → ${user.username}`);
            }
          }
        }
      }
    }
  } finally {
    client.release();
  }
}
