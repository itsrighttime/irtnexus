import { pool } from "#config";
import { logger } from "#utils";

/**
 * Create a MySQL user if it does not exist
 *
 * Safely escapes the password and optionally runs in "plan" mode.
 *
 * @param {Object} user - User object containing:
 *   @property {string} username - MySQL username
 *   @property {string} password - Password for the user
 *   @property {string} [host="%"] - Host for the MySQL user
 * @param {boolean} plan - If true, logs the SQL statement instead of executing it
 * @returns {Promise<void>}
 *
 * @example
 * await createUser({
 *   username: "app_user",
 *   password: "Secret123!",
 *   host: "localhost"
 * }, true); // Logs the plan
 */
export async function createUser(user, plan = false) {
  // Escape single quotes in password to avoid SQL injection
  const password = user.password.replace(/'/g, "\\'");

  const sql = `CREATE USER IF NOT EXISTS '${user.username}'@'${user.host || "%"}' IDENTIFIED BY '${password}'`;

  if (plan) {
    logger.info(`[PLAN] ${sql}`);
    return;
  }

  // Execute SQL to create the user
  const db = await pool.getConnection();
  try {
    await db.execute(sql);
    logger.info(`User ensured: ${user.username}`);
  } finally {
    await db.close();
  }
}

/**
 * Drop a MySQL user if it exists
 *
 * Optionally runs in "plan" mode to log the action without executing.
 *
 * @param {Object} user - User object containing:
 *   @property {string} username - MySQL username
 *   @property {string} [host="%"] - Host for the MySQL user
 * @param {boolean} plan - If true, logs the SQL statement instead of executing it
 * @returns {Promise<void>}
 *
 * @example
 * await dropUser({
 *   username: "app_user",
 *   host: "localhost"
 * }, true); // Logs the plan
 */
export async function dropUser(user, plan = false) {
  const sql = `DROP USER IF EXISTS '${user.username}'@'${user.host || "%"}'`;

  if (plan) {
    logger.warn(`[PLAN] ${sql}`);
    return;
  }

  // Execute SQL to drop the user
  const db = await pool.getConnection();
  try {
    await db.execute(sql);
    logger.warn(`User dropped (if exist): ${user.username}`);
  } finally {
    await db.close();
  }
}
