import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { RolePermission } from "../types";

export class RolePermissionRepository extends BaseRepository<RolePermission> {
  constructor() {
    super({
      tableName: "role_permissions",
      versionTableName: "role_permissions_versions",
      primaryKey: "role_permission_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}
