import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { Tenant } from "../types/Tenant.type";
import { repoConfig } from "#configs";
import { TenantCol } from "../const/dbColumns";

export class TenantRepository extends BaseRepository<Tenant> {
  constructor() {
    super({
      tableName: "tenants",
      versionTableName: "tenants_versions",
      primaryKey: "tenant_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: TenantCol,
    });
  }
}

export const repoTenant = new TenantRepository();
