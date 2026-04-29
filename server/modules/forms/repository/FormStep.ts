import { BaseRepository } from "#packages/database";
import { repoConfig } from "#configs";
import { FormStep } from "../types";
import { FormStepCol } from "../const/dbColumns";

export class FormStepRepository extends BaseRepository<FormStep> {
  constructor() {
    super({
      tableName: "form_steps",
      versionTableName: "form_steps_versions",
      primaryKey: "form_steps_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: FormStepCol,
    });
  }
}

export const repoFormStep = new FormStepRepository();
