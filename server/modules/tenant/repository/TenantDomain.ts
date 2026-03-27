import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { TenantDomain } from "../types";
import { TenantDomainCol } from "../const/dbColumns";

export class TenantDomainRepository extends BaseRepository<TenantDomain> {
  constructor() {
    super({
      tableName: "tenant_domains",
      versionTableName: "tenant_domains_versions",
      primaryKey: "domain_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: TenantDomainCol,
    });
  }
}

export const repoTenantDomain = new TenantDomainRepository();
