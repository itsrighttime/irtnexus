
import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { HardwareKey } from "../types";

export class HardwareKeyRepository extends BaseRepository<HardwareKey> {
  constructor() {
    super({
      tableName: "hardware_keys",
      versionTableName: "hardware_keys_versions",
      primaryKey: "key_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}

export const repoHardwareKey = new HardwareKeyRepository();
