import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { PortalBranding } from "../types";

export class PortalBrandingRepository extends BaseRepository<PortalBranding> {
  constructor() {
    super({
      tableName: "portal_branding",
      versionTableName: "portal_branding_versions",
      primaryKey: "portal_branding_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}
