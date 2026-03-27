import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { AccountEmail } from "../types";
import { AccountEmailCol } from "../const/dbColumns";

export class AccountEmailRepository extends BaseRepository<AccountEmail> {
  constructor() {
    super({
      tableName: "account_emails",
      versionTableName: "account_emails_versions",
      primaryKey: "email_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: AccountEmailCol,
    });
  }
}

export const repoAccountEmail = new AccountEmailRepository();
