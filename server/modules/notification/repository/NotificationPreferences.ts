import { BaseRepository } from "#packages/database";
import { repoConfig } from "#configs";
import { NotificationPreferences } from "../types";
import { NotificationPreferencesCol } from "../const/dbColumns";

export class NotificationPreferencesRepository extends BaseRepository<NotificationPreferences> {
  constructor() {
    super({
      tableName: "notification_preferences",
      versionTableName: "notification_preferences_versions",
      primaryKey: "preference_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: NotificationPreferencesCol,
    });
  }
}

export const repoNotificationPreferences =
  new NotificationPreferencesRepository();
