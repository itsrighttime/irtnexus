import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { TenantMembership } from "../types";
import { TenantMembershipCol } from "../const/dbColumns";

export class TenantMembershipRepository extends BaseRepository<TenantMembership> {
  constructor() {
    super({
      tableName: "tenant_memberships",
      versionTableName: "tenant_memberships_versions",
      primaryKey: "membership_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: TenantMembershipCol,
    });
  }
}

export const repoTenantMembership = new TenantMembershipRepository();
