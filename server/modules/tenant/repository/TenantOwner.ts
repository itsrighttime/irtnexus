import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { TenantOwner } from "../types";

export class TenantOwnerRepository extends BaseRepository<TenantOwner> {
  constructor() {
    super({
      tableName: "tenant_owners",
      versionTableName: "tenant_owners_versions",
      primaryKey: "tenant_owner_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}

export const repoTenantOwner = new TenantOwnerRepository();
