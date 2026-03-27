
import { BaseRepository, DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoConfig } from "#configs";
import { RiskSignal } from "../types";
import { RiskSignalCol } from "../const/dbColumns";

export class RiskSignalRepository extends BaseRepository<RiskSignal> {
  constructor() {
    super({
      tableName: "risk_signals",
      versionTableName: "risk_signals_versions",
      primaryKey: "signal_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: RiskSignalCol
    });
  }
}

export const repoRiskSignal = new RiskSignalRepository();
