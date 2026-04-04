import { BaseRepository } from "#packages/database";
import { repoConfig } from "#configs";
import { NotificationLog } from "../types";
import { NotificationLogCol } from "../const/dbColumns";

export class NotificationLogRepository extends BaseRepository<NotificationLog> {
  constructor() {
    super({
      tableName: "notification_logs",
      versionTableName: "notification_logs_versions",
      primaryKey: "log_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: NotificationLogCol,
    });
  }
}

export const repoNotificationLog = new NotificationLogRepository();
