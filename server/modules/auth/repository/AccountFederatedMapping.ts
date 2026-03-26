import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { AccountFederatedMapping } from "../types";

export class AccountFederatedMappingRepository extends BaseRepository<AccountFederatedMapping> {
  constructor() {
    super({
      tableName: "account_federated_mapping",
      versionTableName: "account_federated_mapping_versions",
      primaryKey: "mapping_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}

export const repoAccountFederatedMapping = new AccountFederatedMappingRepository();
