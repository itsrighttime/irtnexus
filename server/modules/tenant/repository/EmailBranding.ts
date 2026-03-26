import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { EmailBranding } from "../types";

export class EmailBrandingRepository extends BaseRepository<EmailBranding> {
  constructor() {
    super({
      tableName: "email_branding",
      versionTableName: "email_branding_versions",
      primaryKey: "email_branding_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}
