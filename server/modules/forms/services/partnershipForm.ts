import { DB_RequestContext } from "#packages/database/index.js";
import { ValidationError } from "#packages/errors/AppError.js";
import { FileRecord } from "#packages/storage";
import { getFormConfig } from "../configs";
import { repoFormSubmission } from "../repository";
import { configToSchema } from "../validation/configToSchema";
import { validateResponse } from "../validation/validateResponse";

export const ssPartnershipForm = async (
  files: FileRecord[],
  field: Record<string, any>,
  ctx: DB_RequestContext,
) => {
  const config = getFormConfig("partnership");
  const formData = { ...files, ...field };

  const schema = configToSchema(config);
  const { valid, errors } = validateResponse(schema, formData);

  if (!valid) {
    throw new ValidationError("Response is not valid", "X02568", errors);
  }

  const data = { field, files };

  await repoFormSubmission.create({ data: data }, ctx);

  return;
};
