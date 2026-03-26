import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { MfaFactor } from "../types";

export class MfaFactorRepository extends BaseRepository<MfaFactor> {
  constructor() {
    super({
      tableName: "mfa_factors",
      versionTableName: "mfa_factors_versions",
      primaryKey: "factor_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
    });
  }
}
