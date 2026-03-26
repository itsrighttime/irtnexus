import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { TenantRole } from "../types";

export class TenantRoleRepository extends BaseRepository<TenantRole> {
  constructor() {
    super({
      tableName: "tenant_roles",
      versionTableName: "tenant_roles_versions",
      primaryKey: "role_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}

export const repoTenantRole = new TenantRoleRepository();
