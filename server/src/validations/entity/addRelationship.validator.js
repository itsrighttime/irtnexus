import { UtilsValidator } from "#packages";
import { graphService } from "#services";

const { validatePayload, VALIDATOR_KEY: KEY } = UtilsValidator;

/**
 * Validates the payload for adding a relationship.
 *
 * @param {object} payload - The request payload
 * @param {string} payload.fromId - Base64 ID of the source entity
 * @param {string} payload.toId - Base64 ID of the target entity
 * @param {string} payload.relationshipType - Type of relationship/edge
 * @param {string} [payload.constraints="{}"] - Optional JSON constraints
 * @returns {object} Validation result with `valid` boolean and sanitized `value`
 */
export const addRelationship = (payload = {}) => {
  const { fromId, toId, relationshipType, constraints = "{}" } = payload;

  const schema = {
    fromId: [KEY.required, KEY.base64],
    toId: [KEY.required, KEY.base64],
    relationshipType: [KEY.required, [KEY.oneOf, graphService.getEdgeTypes()]],
    constraints: [KEY.json],
  };

  const _payload = { fromId, toId, relationshipType, constraints };
  return validatePayload(schema, _payload);
};
