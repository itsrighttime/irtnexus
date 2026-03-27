import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { AccountAddress } from "../types";
import { AccountAddressCol } from "../const/dbColumns";

export class AccountAddressRepository extends BaseRepository<AccountAddress> {
  constructor() {
    super({
      tableName: "account_addresses",
      versionTableName: "account_addresses_versions",
      primaryKey: "address_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: AccountAddressCol,
    });
  }
}

export const repoAccountAddress = new AccountAddressRepository();
