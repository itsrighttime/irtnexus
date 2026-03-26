
import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { Password } from "../types";

export class PasswordRepository extends BaseRepository<Password> {
  constructor() {
    super({
      tableName: "passwords",
      versionTableName: "passwords_versions",
      primaryKey: "password_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}
