import { UtilsValidator } from "#packages";
import { graphService } from "#services";
import { regEx } from "../regex/index.js";

const { validatePayload, VALIDATOR_KEY: KEY } = UtilsValidator;

export const updateEntity = (payload = {}) => {
  const { name, meta, status, id } = payload;

  const schema = {
    id: [KEY.base64, KEY.required],
    name: [KEY.string, [KEY.matches, regEx.lettersAndSpaces], KEY.safe],
    meta: [KEY.json],
    status: [[KEY.oneOf, ["active", "inactive", "archived", undefined]]],
  };

  // Normalize payload with defaults for optional fields
  const _payload = {
    name,
    meta,
    status,
    id,
  };

  return validatePayload(schema, _payload);
};
