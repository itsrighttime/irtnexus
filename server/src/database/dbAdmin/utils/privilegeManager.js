import { normalizeGrant } from "./grantUtils.js";
import { logger } from "#utils";
import { pool } from "#config";

/**
 * Synchronize MySQL user privileges
 *
 * Ensures that a given MySQL user has the required privileges.
 * Compares the current grants with the desired privileges and applies any missing ones.
 * Supports a "plan" mode where changes are logged but not executed.
 *
 * @param {Object} user - User object containing:
 *   @property {string} username - MySQL username
 *   @property {string} host - MySQL host (optional, defaults to "%")
 *   @property {Array<Object>} privileges - Desired privileges, each object:
 *     @property {string} db - Database name
 *     @property {Array<string>} actions - List of actions (SELECT, INSERT, etc.)
 *     @property {Array<string>} tables - List of tables (default: ["*"])
 * @param {boolean} plan - If true, only logs the GRANT statements without executing
 *
 * @returns {Promise<void>}
 *
 * @example
 * await syncPrivileges({
 *   username: "app_user",
 *   host: "localhost",
 *   privileges: [
 *     { db: "mydb", actions: ["SELECT", "INSERT"], tables: ["users", "orders"] }
 *   ]
 * }, true); // Only logs planned grants
 */
export async function syncPrivileges(user, plan = false) {
  // Skip if user has no privileges defined
  if (!user.privileges?.length) return;

  // Get a connection from the pool
  const adminDB = await pool.getConnection();

  try {
    // Fetch current grants for the user
    const [rows] = await adminDB.query(
      `SHOW GRANTS FOR '${user.username}'@'${user.host || "%"}'`,
    );

    // Normalize existing grants to compare
    const existing = new Set(rows.map((r) => normalizeGrant(r)));

    // Loop through desired privileges
    for (const p of user.privileges) {
      const tables = p.tables || ["*"];
      const actions = p.actions.join(", ");

      for (const table of tables) {
        const expected = `${actions} ON ${p.db}.${table}`;

        // If privilege is missing, apply it
        if (!existing.has(expected)) {
          const sql = `GRANT ${expected} TO '${user.username}'@'${user.host || "%"}'`;

          if (plan) {
            logger.info(`[PLAN] ${sql}`);
          } else {
            await adminDB.execute(sql);
            logger.info(`Granted: ${expected} → ${user.username}`);
          }
        }
      }
    }

    // Flush privileges to ensure changes take effect
    if (!plan) await adminDB.execute("FLUSH PRIVILEGES");
  } finally {
    // Always close the connection
    await adminDB.close();
  }
}
