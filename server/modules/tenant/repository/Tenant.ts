import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { Tenant } from "../types/Tenant.type";
import { repoConfig } from "#configs";

export class TenantRepository extends BaseRepository<Tenant> {
  constructor() {
    super({
      tableName: "tenants",
      versionTableName: "tenants_versions",
      primaryKey: "tenant_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }

  async findByIdentifier(
    identifier: string,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<Tenant[]> {
    const columns = this.columnsFor({ exclude: ["created_at", "updated_at"] });

    const rows = await this.select<Tenant>(
      `SELECT ${columns} FROM tenants WHERE identifier = $1`,
      [identifier],
      ctx,
      client,
    );

    return rows;
  }
}

export const repoTenant = new TenantRepository();
