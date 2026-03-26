import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { OAuthToken } from "../types";

export class OAuthTokenRepository extends BaseRepository<OAuthToken> {
  constructor() {
    super({
      tableName: "oauth_tokens",
      versionTableName: "oauth_tokens_versions",
      primaryKey: "token_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}

export const repoOAuthToken = new OAuthTokenRepository();
