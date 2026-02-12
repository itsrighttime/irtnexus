import { UtilsValidator } from "#packages";
import { graphService } from "#services";
import { regEx } from "../regex/index.js";

const { validatePayload, VALIDATOR_KEY: KEY } = UtilsValidator;

export const createEntity = (payload = {}) => {
  const { name, type, meta } = payload;

  const schema = {
    name: [
      KEY.required,
      KEY.string,
      [KEY.matches, regEx.lettersAndSpaces],
      KEY.safe,
    ],
    type: [KEY.required, [KEY.oneOf, graphService.getEnityTypes()]],
    meta: [KEY.json],
  };

  // Normalize payload with defaults for optional fields
  const _payload = {
    name,
    type,
    meta,
  };

  return validatePayload(schema, _payload);
};
