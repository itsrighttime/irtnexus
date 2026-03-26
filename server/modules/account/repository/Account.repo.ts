import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { Account } from "../types/Account.type";
import { repoConfig } from "#configs";

export class AccountRepository extends BaseRepository<Account> {
  constructor() {
    super({
      tableName: "accounts",
      versionTableName: "accounts_versions",
      primaryKey: "account_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: false,
    });
  }

  async findByUsername(
    username: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<Account | null> {
    const normalized = username.toLowerCase().trim();

    // Use columnsFor to generate SELECT columns dynamically
    const columns = this.columnsFor(); // returns "account_id","username","status",...

    const rows = await this.select<Account>(
      `SELECT ${columns} FROM ${this.tableName} WHERE LOWER(username) = $1`,
      [normalized],
      ctx,
      client,
    );

    return rows[0] || null;
  }

  async findByUsernameExcludeMeta(
    username: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<Account | null> {
    // Exclude created_at / updated_at for lighter query
    const columns = this.columnsFor({ exclude: ["created_at", "updated_at"] });

    const rows = await this.select<Account>(
      `SELECT ${columns} FROM ${this.tableName} WHERE LOWER(username) = $1`,
      [username.toLowerCase().trim()],
      ctx,
      client,
    );

    return rows[0] || null;
  }
}
