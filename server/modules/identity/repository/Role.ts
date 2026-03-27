import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { Role } from "../types";
import { RoleCol } from "../const/dbColumns";

export class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super({
      tableName: "roles",
      versionTableName: "roles_versions",
      primaryKey: "role_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: RoleCol,
    });
  }
}

export const repoRole = new RoleRepository();
