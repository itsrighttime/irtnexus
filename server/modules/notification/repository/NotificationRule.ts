import { BaseRepository } from "#packages/database";
import { repoConfig } from "#configs";
import { NotificationRule } from "../types";
import { NotificationRuleCol } from "../const/dbColumns";

export class NotificationRuleRepository extends BaseRepository<NotificationRule> {
  constructor() {
    super({
      tableName: "notification_rules",
      versionTableName: "notification_rules_versions",
      primaryKey: "rule_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: NotificationRuleCol,
    });
  }
}

export const repoNotificationRule = new NotificationRuleRepository();
