import { BaseRepository } from "#packages/database";
import { repoConfig } from "#configs";
import { NotificationJob } from "../types";
import { NotificationJobCol } from "../const/dbColumns";

export class NotificationJobRepository extends BaseRepository<NotificationJob> {
  constructor() {
    super({
      tableName: "notification_jobs",
      versionTableName: "notification_jobs_versions",
      primaryKey: "job_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: NotificationJobCol,
    });
  }
}

export const repoNotificationJob = new NotificationJobRepository();
