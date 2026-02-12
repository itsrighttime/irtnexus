import mysql from "mysql2/promise";

/**
 * Database wrapper class for MySQL using mysql2/promise.
 * Provides helper methods for queries, execution, and transactions.
 */
export class Database {
  /**
   * Creates a new Database instance with a connection pool.
   *
   * @param {Object} config - MySQL connection pool configuration
   */
  constructor(config) {
    // Create a MySQL connection pool for efficient reuse
    this.pool = mysql.createPool(config);
  }

  /**
   * Executes a SELECT query and returns result rows.
   *
   * @param {string} query - SQL select query
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>} Result rows
   */
  async select(query, params = []) {
    const [rows] = await this.pool.execute(query, params);
    return rows;
  }

  /**
   * Executes a raw query.
   * Useful for complex queries or multiple statements.
   *
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>} Query result rows
   */
  async query(query, params = []) {
    const [rows] = await this.pool.query(query, params);
    return rows;
  }

  /**
   * Executes a prepared statement (INSERT, UPDATE, DELETE).
   *
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} Execution result (affectedRows, insertId, etc.)
   */
  async execute(query, params = []) {
    const [result] = await this.pool.execute(query, params);
    return result;
  }

  /**
   * Runs a callback inside a database transaction.
   * Automatically commits on success and rolls back on error.
   *
   * @param {Function} callback - Async function receiving a DB connection
   * @returns {Promise<any>} Result returned by callback
   */
  async transaction(callback) {
    const conn = await this.pool.getConnection();

    try {
      await conn.beginTransaction();

      // Execute user-defined transactional logic
      const result = await callback(conn);

      await conn.commit();
      return result;
    } catch (err) {
      // Roll back transaction on failure
      await conn.rollback();
      throw err;
    } finally {
      // Always release the connection back to the pool
      conn.release();
    }
  }

  /**
   * Gracefully closes the database connection pool.
   *
   * @returns {Promise<void>}
   */
  async close() {
    await this.pool.end();
  }
}
