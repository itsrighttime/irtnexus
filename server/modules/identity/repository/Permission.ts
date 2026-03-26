import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { Permission } from "../types";

export class PermissionRepository extends BaseRepository<Permission> {
  constructor() {
    super({
      tableName: "permissions",
      versionTableName: "permissions_versions",
      primaryKey: "permission_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}

export const repoPermission = new PermissionRepository();
