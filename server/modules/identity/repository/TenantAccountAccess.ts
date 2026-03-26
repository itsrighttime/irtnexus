import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { TenantAccountAccess } from "../types";

export class TenantAccountAccessRepository extends BaseRepository<TenantAccountAccess> {
  constructor() {
    super({
      tableName: "tenant_account_access",
      versionTableName: "tenant_account_access_versions",
      primaryKey: "tenant_account_access_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}
