import { BaseRepository } from "#packages/database";
import { repoConfig } from "#configs";
import { NotificationTemplate } from "../types";
import { NotificationTemplateCol } from "../const/dbColumns";

export class NotificationTemplateRepository extends BaseRepository<NotificationTemplate> {
  constructor() {
    super({
      tableName: "notification_templates",
      versionTableName: "notification_templates_versions",
      primaryKey: "template_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: NotificationTemplateCol,
    });
  }
}

export const repoNotificationTemplate = new NotificationTemplateRepository();
