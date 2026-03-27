import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { Account } from "../types/Account.type";
import { repoConfig } from "#configs";
import { AccountCol } from "../const/dbColumns";

export class AccountRepository extends BaseRepository<Account> {
  constructor() {
    super({
      tableName: "accounts",
      versionTableName: "accounts_versions",
      primaryKey: "account_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: false,
      allowedColumns: AccountCol,
    });
  }
}

export const repoAccount = new AccountRepository();
