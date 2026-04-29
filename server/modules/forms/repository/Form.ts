import { BaseRepository } from "#packages/database";
import { repoConfig } from "#configs";
import { Form } from "../types";
import { FormCol } from "../const/dbColumns";

export class FormRepository extends BaseRepository<Form> {
  constructor() {
    super({
      tableName: "forms",
      versionTableName: "forms_versions",
      primaryKey: "form_id",
      asyncVersioning: repoConfig.asyncVersioning,
      asyncWrites: repoConfig.asyncWrites,
      allowedColumns: FormCol,
    });
  }
}

export const repoForm = new FormRepository();
