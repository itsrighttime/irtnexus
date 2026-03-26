import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { TenantMembership } from "../types";

export class TenantMembershipRepository extends BaseRepository<TenantMembership> {
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
