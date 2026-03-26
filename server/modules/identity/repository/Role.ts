import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { Role } from "../types";

export class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super({
      tableName: "roles",
      versionTableName: "roles_versions",
      primaryKey: "role_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }

  async findByName(
    name: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<Role | null> {
    const normalized = name.toLowerCase().trim();

    const columns = this.columnsFor();

    const result = await this.select<Role>(
      `
      SELECT ${columns}
      FROM ${this.tableName}
      WHERE LOWER(name) = $1
        AND deleted_at IS NULL
      LIMIT 1
      `,
      [normalized],
      ctx,
      client,
    );

    return result[0];
  }
}

export const repoRole = new RoleRepository();
