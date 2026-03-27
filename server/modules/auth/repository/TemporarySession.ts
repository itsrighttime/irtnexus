import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { TemporarySession } from "../types";
import { TemporarySessionCol } from "../const/dbColumns";

export class TemporarySessionRepository extends BaseRepository<TemporarySession> {
  constructor() {
    super({
      tableName: "temporary_sessions",
      versionTableName: "temporary_sessions_versions",
      primaryKey: "session_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: TemporarySessionCol,
    });
  }
}

export const repoTemporarySession = new TemporarySessionRepository();
