import { BaseRepository } from "#packages/database";
import { repoConfig } from "#configs";
import { FormSubmission } from "../types";
import { FormSubmissionCol } from "../const/dbColumns";

export class FormSubmissionRepository extends BaseRepository<FormSubmission> {
  constructor() {
    super({
      tableName: "form_submissions",
      versionTableName: "form_submissions_versions",
      primaryKey: "form_submissions_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: FormSubmissionCol,
    });
  }
}

export const repoFormSubmission = new FormSubmissionRepository();
