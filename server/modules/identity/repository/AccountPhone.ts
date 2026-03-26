import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { AccountPhone } from "../types";

export class AccountPhoneRepository extends BaseRepository<AccountPhone> {
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
