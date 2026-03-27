
import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { FederatedProvider } from "../types";
import { FederatedProviderCol } from "../const/dbColumns";

export class FederatedProviderRepository extends BaseRepository<FederatedProvider> {
  constructor() {
    super({
      tableName: "federated_providers",
      versionTableName: "federated_providers_versions",
      primaryKey: "provider_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: FederatedProviderCol
    });
  }
}

export const repoFederatedProvider = new FederatedProviderRepository();
