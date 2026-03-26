import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { AccountName } from "../types";

export class AccountNameRepository extends BaseRepository<AccountName> {
  constructor() {
    super({
      tableName: "account_names",
      versionTableName: "account_names_versions",
      primaryKey: "name_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}
