import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { Role } from "../types";

export class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super({
      tableName: "accounts",
      versionTableName: "accounts_versions",
      primaryKey: "account_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}
