
import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { AccountSsoMapping } from "../types";
import { AccountSsoMappingCol } from "../const/dbColumns";

export class AccountSsoMappingRepository extends BaseRepository<AccountSsoMapping> {
  constructor() {
    super({
      tableName: "account_sso_mapping",
      versionTableName: "account_sso_mapping_versions",
      primaryKey: "mapping_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: AccountSsoMappingCol
    });
  }
}

export const repoAccountSsoMapping = new AccountSsoMappingRepository();
