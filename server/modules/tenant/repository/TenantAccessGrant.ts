import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { TenantAccessGrant } from "../types";
import { TenantAccessGrantCol } from "../const/dbColumns";

export class TenantAccessGrantRepository extends BaseRepository<TenantAccessGrant> {
  constructor() {
    super({
      tableName: "tenant_access_grants",
      versionTableName: "tenant_access_grants_versions",
      primaryKey: "access_grant_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: TenantAccessGrantCol,
    });
  }
}

export const repoTenantAccessGrant = new TenantAccessGrantRepository();
