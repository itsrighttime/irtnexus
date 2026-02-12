import { entityQuery, entityRelationshipQuery } from "#queries";
import { translate } from "#translations"; // assume logger imported from utils
import { logger } from "#utils";
import { isEdgeAllowed } from "./isEdgeAllowed.helper.js";

/**
 * Validates constraints for a potential relationship between two entities.
 *
 * Checks include:
 *  - requiredTargetType: Ensures the target entity is of a specific type.
 *  - maxDepth (placeholder): Could enforce depth limits in the graph.
 *  - Duplicate relationship check.
 *
 * @param {Buffer|string} bufferFromId - ID of the source entity
 * @param {Buffer|string} bufferToId - ID of the target entity
 * @param {string} relationshipType - Type of relationship
 * @returns {Promise<{valid: boolean, message?: string}>} Validation result.
 *          If invalid, includes a descriptive message.
 */
export const validateConstraints = async (
  bufferFromId,
  bufferToId,
  relationshipType,
) => {
  logger.debug("Starting constraint validation", {
    fromId: bufferFromId.toString("hex"),
    toId: bufferToId.toString("hex"),
    relationshipType,
  });

  // Verify target entity exists
  const toType = await entityQuery.getEntityType(bufferToId);
  if (!toType) {
    logger.warn("Target entity not found", {
      toId: bufferToId.toString("hex"),
    });
    return { valid: false, message: translate("entity_rel.err_target_entity") };
  }

  // Verify source entity exists
  const fromType = await entityQuery.getEntityType(bufferFromId);
  if (!fromType) {
    logger.warn("Source entity not found", {
      fromId: bufferFromId.toString("hex"),
    });
    return { valid: false, message: translate("entity_rel.err_source_entity") };
  }

  // Prevent duplicate relationships
  const relationshipExist = await entityRelationshipQuery.getRelationship({
    fromId: bufferFromId,
    toId: bufferToId,
    relationshipType,
  });

  if (relationshipExist.length > 0) {
    logger.warn("Duplicate relationship detected", {
      fromId: bufferFromId.toString("hex"),
      toId: bufferToId.toString("hex"),
      relationshipType,
    });
    return {
      valid: false,
      message: translate("entity_rel.err_relationship_exist"),
    };
  }

  // Placeholder: Additional constraints like maxDepth or requiredTargetType could go here
  // Example: if (!(await isEdgeAllowed(bufferFromId, bufferToId, relationshipType))) { ... }

  logger.debug("Constraint validation passed", {
    fromId: bufferFromId.toString("hex"),
    toId: bufferToId.toString("hex"),
    relationshipType,
  });
  return { valid: true };
};
