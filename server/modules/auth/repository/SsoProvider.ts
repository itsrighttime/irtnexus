
import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { SsoProvider } from "../types";
import { SsoProviderCol } from "../const/dbColumns";

export class SsoProviderRepository extends BaseRepository<SsoProvider> {
  constructor() {
    super({
      tableName: "sso_providers",
      versionTableName: "sso_providers_versions",
      primaryKey: "sso_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: SsoProviderCol
    });
  }
}

export const repoSsoProvider = new SsoProviderRepository();
