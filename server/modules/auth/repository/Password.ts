
import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { Password } from "../types";
import { PasswordCol } from "../const/dbColumns";

export class PasswordRepository extends BaseRepository<Password> {
  constructor() {
    super({
      tableName: "passwords",
      versionTableName: "passwords_versions",
      primaryKey: "password_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: PasswordCol
    });
  }
}

export const repoPassword = new PasswordRepository();
