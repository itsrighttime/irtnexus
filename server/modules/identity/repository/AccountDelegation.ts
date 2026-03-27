import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { AccountDelegation } from "../types";
import { AccountDelegationCol } from "../const/dbColumns";

export class AccountDelegationRepository extends BaseRepository<AccountDelegation> {
  constructor() {
    super({
      tableName: "account_delegations",
      versionTableName: "account_delegations_versions",
      primaryKey: "delegation_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: AccountDelegationCol,
    });
  }
}

export const repoAccountDelegation = new AccountDelegationRepository();
