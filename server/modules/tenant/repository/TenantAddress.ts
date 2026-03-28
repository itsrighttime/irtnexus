import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import {} from "../types";
import { TenantAddress } from "../types/TenantAddress";
import { TenantAddressCol } from "../const/dbColumns";

export class TenantAddressRepository extends BaseRepository<TenantAddress> {
  constructor() {
    super({
      tableName: "account_addresses",
      versionTableName: "account_addresses_versions",
      primaryKey: "address_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: TenantAddressCol,
    });
  }
}

export const repoTenantAddress = new TenantAddressRepository();
