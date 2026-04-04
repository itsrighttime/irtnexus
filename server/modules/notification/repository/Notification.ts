import { BaseRepository } from "#packages/database";
import { repoConfig } from "#configs";
import { Notification } from "../types";
import { NotificationCol } from "../const/dbColumns";

export class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super({
      tableName: "notifications",
      versionTableName: "notifications_versions",
      primaryKey: "notification_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: NotificationCol,
    });
  }
}

export const repoNotification = new NotificationRepository();
