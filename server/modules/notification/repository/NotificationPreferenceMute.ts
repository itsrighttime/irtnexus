import { BaseRepository } from "#packages/database";
import { repoConfig } from "#configs";
import { NotificationPreferenceMute } from "../types";
import { NotificationPreferenceMuteCol } from "../const/dbColumns";

export class NotificationPreferenceMuteRepository extends BaseRepository<NotificationPreferenceMute> {
  constructor() {
    super({
      tableName: "notification_preference_mutes",
      versionTableName: "notification_preference_mutes_versions",
      primaryKey: "mute_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: NotificationPreferenceMuteCol,
    });
  }
}

export const repoNotificationPreferenceMute =
  new NotificationPreferenceMuteRepository();
