import { BaseRepository } from "#packages/database";
import { repoConfig } from "#configs";
import { NotificationRecipient } from "../types";
import { NotificationRecipientCol } from "../const/dbColumns";

export class NotificationRecipientRepository extends BaseRepository<NotificationRecipient> {
  constructor() {
    super({
      tableName: "notification_recipients",
      versionTableName: "notification_recipients_versions",
      primaryKey: "recipient_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: NotificationRecipientCol,
    });
  }
}

export const repoNotificationRecipient = new NotificationRecipientRepository();
