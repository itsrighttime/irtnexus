
import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { FederatedProvider } from "../types";

export class FederatedProviderRepository extends BaseRepository<FederatedProvider> {
  constructor() {
    super({
      tableName: "federated_providers",
      versionTableName: "federated_providers_versions",
      primaryKey: "provider_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}
