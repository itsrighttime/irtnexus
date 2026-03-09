import { logger } from "#utils";
import { pool } from "#config";
import mysql from "mysql2";

/**
 * Rotate a MySQL user's password
 *
 * Updates the password for a specific MySQL user.
 * Can optionally run in "plan" mode to log the action without executing it.
 *
 * @param {Object} user - User object containing:
 *   @property {string} username - MySQL username
 *   @property {string} host - MySQL host (optional, defaults to "%")
 *   @property {string} password - New password to set
 *   @property {boolean} rotatePassword - Flag indicating if password should be rotated
 * @param {boolean} plan - If true, only log the planned rotation without executing
 *
 * @returns {Promise<void>}
 *
 * @example
 * await rotatePassword({
 *   username: "app_user",
 *   host: "localhost",
 *   password: "NewSecret123!",
 *   rotatePassword: true
 * }, true); // Logs the plan without executing
 */
export async function rotatePassword(user, plan = false) {
  // Skip rotation if the flag is false
  if (!user.rotatePassword) return;

  // Build SQL query safely using mysql.format to prevent SQL injection
  const sql = mysql.format(
    `SET PASSWORD FOR '${user.username}'@'${user.host || "%"}' = ?`,
    [user.password],
  );

  // Plan mode: only log the intended action
  if (plan) {
    logger.info(`[PLAN] Rotate password for ${user.username}`);
    return;
  }

  // Get a database connection
  const db = await pool.getConnection();
  try {
    // Execute the password rotation
    await db.query(sql);
    logger.info(`Password rotated for ${user.username}`);
  } finally {
    // Ensure the connection is closed
    await db.close();
  }
}
