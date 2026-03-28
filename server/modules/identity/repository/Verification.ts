import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { VerificationCol } from "../const/dbColumns";
import { Verification } from "../types";

export class VerificationRepository extends BaseRepository<Verification> {
  constructor() {
    super({
      tableName: "verifications",
      versionTableName: "verifications_versions",
      primaryKey: "verification_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: VerificationCol,
    });
  }
}

export const repoVerification = new VerificationRepository();
