import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { AccountPhone } from "../types";

export class AccountPhoneRepository extends BaseRepository<AccountPhone> {
  constructor() {
    super({
      tableName: "account_phones",
      versionTableName: "account_phones_versions",
      primaryKey: "phone_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}

export const repoAccountPhone = new AccountPhoneRepository();
