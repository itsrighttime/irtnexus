
import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { HardwareKey } from "../types";
import { HardwareKeyCol } from "../const/dbColumns";

export class HardwareKeyRepository extends BaseRepository<HardwareKey> {
  constructor() {
    super({
      tableName: "hardware_keys",
      versionTableName: "hardware_keys_versions",
      primaryKey: "key_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: HardwareKeyCol
    });
  }
}

export const repoHardwareKey = new HardwareKeyRepository();
