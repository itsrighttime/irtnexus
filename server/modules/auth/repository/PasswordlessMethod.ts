
import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { PasswordlessMethod } from "../types";
import { PasswordlessMethodCol } from "../const/dbColumns";

export class PasswordlessMethodRepository extends BaseRepository<PasswordlessMethod> {
  constructor() {
    super({
      tableName: "passwordless_methods",
      versionTableName: "passwordless_methods_versions",
      primaryKey: "method_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: PasswordlessMethodCol
    });
  }
}

export const repoPasswordlessMethod = new PasswordlessMethodRepository();
