// databaseFactory.js
import { Database } from "./database.js";
import userConfig from "../config/user.config.js";
import { DB_USER_PASS } from "#config";

/**
 * DatabaseFactory
 *
 * Centralized factory for managing MySQL Database instances.
 * - Creates and caches connection pools per DB user
 * - Lazily initializes pools on first access
 * - Supports runtime credential rotation
 */
export class DatabaseFactory {
  /**
   * Cache of Database instances keyed by username.
   * Ensures one pool per DB user.
   *
   * @type {Object<string, Database>}
   */
  static pools = {};

  /**
   * Returns a Database instance for a given DB username.
   * Uses lazy initialization and caches the pool.
   *
   * @param {string} username - Database username
   * @returns {Database} Database instance
   * @throws {Error} If no config is found for the user
   */
  static #getDatabase(username) {
    // Lazily create the pool if it doesn't exist
    if (!this.pools[username]) {
      const user = this.#getUserConfig(username);

      if (!user) {
        throw new Error(`No DB config found for user: ${username}`);
      }

      // Build MySQL pool configuration
      const dbConfig = {
        host: user.host,
        user: user.username,
        password: user.password,
        database: user.database || this.#guessDatabase(user.username),
        waitForConnections: true,
        connectionLimit: this.#getConnectionLimit(user.username),
      };

      this.pools[username] = new Database(dbConfig);
    }

    return this.pools[username];
  }

  /**
   * Retrieves DB user configuration from user.config.js.
   *
   * @param {string} username - Database username
   * @returns {Object|undefined} User config entry
   */
  static #getUserConfig(username) {
    return userConfig.users.find((u) => u.username === username);
  }

  /**
   * Determines which database name to use for a given user.
   * Can be customized for special users.
   *
   * @param {string} username - Database username
   * @returns {string} Database name
   */
  static #guessDatabase(username) {
    // Example mappings:
    // if (username === "report_user") return "reporting_db";
    // if (username === "dev_user") return "dev_db";

    return "irt-dev"; // default database
  }

  /**
   * Determines connection pool size based on user role.
   * Read-heavy users get larger pools.
   *
   * @param {string} username - Database username
   * @returns {number} Connection limit
   */
  static #getConnectionLimit(username) {
    const readHeavy = ["report_user", "readonly_sensitive"];
    const writeHeavy = ["op_user", "integration_user"];

    if (readHeavy.includes(username)) return 20;
    if (writeHeavy.includes(username)) return 10;

    return 5; // default pool size
  }

  /**
   * Rotates a database user's password at runtime.
   * Closes and reinitializes the existing pool if present.
   *
   * @param {string} username - Database username
   * @param {string} newPassword - New database password
   * @returns {Promise<Database>} New Database instance
   */
  static async rotatePassword(username, newPassword) {
    const user = this.#getUserConfig(username);
    if (!user) {
      throw new Error(`User not found: ${username}`);
    }

    // Update in-memory config
    user.password = newPassword;

    // Tear down existing pool so it can be recreated
    if (this.pools[username]) {
      await this.pools[username].close();
      delete this.pools[username];
    }

    // Return a fresh Database instance
    return this.#getDatabase(username);
  }

  /**
   * -----------------------
   * Convenience getters
   * -----------------------
   * These provide semantic access to DB roles
   * and prevent hardcoding usernames elsewhere.
   */

  static userReport() {
    return this.#getDatabase(DB_USER_PASS.REPORT.USER);
  }

  static userReadonlySensitive() {
    return this.#getDatabase(DB_USER_PASS.READONLY_SENSI.USER);
  }

  static userOp() {
    return this.#getDatabase(DB_USER_PASS.OP.USER);
  }

  static userIntegration() {
    return this.#getDatabase(DB_USER_PASS.INTEGRATION.USER);
  }

  static userBilling() {
    return this.#getDatabase(DB_USER_PASS.BILLING.USER);
  }

  static userAudit() {
    return this.#getDatabase(DB_USER_PASS.AUDIT.USER);
  }

  static userAdmin() {
    return this.#getDatabase(DB_USER_PASS.ADMIN.USER);
  }
}
