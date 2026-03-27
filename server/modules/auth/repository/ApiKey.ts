
import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { ApiKey } from "../types";
import { ApiKeyCol } from "../const/dbColumns";

export class ApiKeyRepository extends BaseRepository<ApiKey> {
  constructor() {
    super({
      tableName: "api_keys",
      versionTableName: "api_keys_versions",
      primaryKey: "key_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: ApiKeyCol
    });
  }
}

export const repoApiKey = new ApiKeyRepository();
