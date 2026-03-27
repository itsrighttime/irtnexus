import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { TenantSetting } from "../types";
import { TenantSettingCol } from "../const/dbColumns";

export class TenantSettingRepository extends BaseRepository<TenantSetting> {
  constructor() {
    super({
      tableName: "tenant_settings",
      versionTableName: "tenant_settings_versions",
      primaryKey: "setting_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: TenantSettingCol,
    });
  }
}

export const repoTenantSetting = new TenantSettingRepository();
