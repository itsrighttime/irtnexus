import { Pool } from "pg";
import { Database } from "./Database";
import { DB_GLOBAL } from "#config";
import { DB_USERS } from "#database/config/user.config.js";
import { DB_USER_PASS } from "#database/constant/dbRoles.js";

export class DatabaseFactory {
  private static pools: Map<string, Database> = new Map();

  private static getUserConfig(username: string) {
    return DB_USERS.find((u) => u.username === username);
  }

  private static guessDatabase() {
    return DB_GLOBAL.database;
  }

  private static getConnectionLimit(username: string) {
    const readHeavy = ["report_user", "readonly_sensitive"];
    const writeHeavy = ["op_user", "integration_user"];

    if (readHeavy.includes(username)) return 20;
    if (writeHeavy.includes(username)) return 10;

    return 5;
  }

  private static createPool(username: string): Database {
    const user = this.getUserConfig(username);

    if (!user) {
      throw new Error(`No DB config found for user: ${username}`);
    }

    const pool = new Pool({
      host: user.host,
      user: user.username,
      password: user.password,
      database: this.guessDatabase(),
      max: this.getConnectionLimit(username),
    });

    return new Database(pool);
  }

  static getDatabase(username: string): Database {
    if (!this.pools.has(username)) {
      const db = this.createPool(username);

      this.pools.set(username, db);
    }

    return this.pools.get(username)!;
  }

  static async rotatePassword(username: string, newPassword: string) {
    const user = this.getUserConfig(username);

    if (!user) {
      throw new Error(`User not found: ${username}`);
    }

    user.password = newPassword;

    const existing = this.pools.get(username);

    if (existing) {
      await existing.close();

      this.pools.delete(username);
    }

    return this.getDatabase(username);
  }

  // convenience getters

  static userReport() {
    return this.getDatabase(DB_USER_PASS.REPORT.USER);
  }

  static userOp() {
    return this.getDatabase(DB_USER_PASS.OP.USER);
  }

  static userIntegration() {
    return this.getDatabase(DB_USER_PASS.INTEGRATION.USER);
  }

  static userBilling() {
    return this.getDatabase(DB_USER_PASS.BILLING.USER);
  }

  static userAudit() {
    return this.getDatabase(DB_USER_PASS.AUDIT.USER);
  }

  static userAdmin() {
    return this.getDatabase(DB_USER_PASS.ADMIN.USER);
  }
}
