import { entityRelationshipQuery as ERQ } from "#queries";
import { translate } from "#translations";
import { logger } from "#utils";
import { SYSTEM_LIMITS } from "../config/systemLimits.js";

/**
 * Validates whether a new edge (relationship) can be created between two entities.
 *
 * Checks include:
 * 1. Self-loop prevention
 * 2. Maximum outgoing edges per type (source entity)
 * 3. Maximum incoming edges per type (target entity)
 *
 * @param {Buffer} bufferFromId - Source entity ID
 * @param {Buffer} bufferToId - Target entity ID
 * @param {string} relationshipType - Type of relationship
 * @returns {Promise<{ valid: boolean, message?: string }>} Validation result.
 */
export const validateEdge = async (
  bufferFromId,
  bufferToId,
  relationshipType,
) => {
  logger.debug("Starting edge validation", {
    fromId: bufferFromId.toString("hex"),
    toId: bufferToId.toString("hex"),
    relationshipType,
  });

  // Prevent self-loops
  if (bufferFromId.equals(bufferToId)) {
    logger.warn("Self-loop detected", { id: bufferFromId.toString("hex") });
    return { valid: false, message: translate("entity_rel.err_self_loop") };
  }

  // Count existing edges
  const countOutgoing = await ERQ.countEdges({
    fromId: bufferFromId,
    isIncomming: false,
  });
  const countIncomming = await ERQ.countEdges({ toId: bufferToId });

  // Fetch system limits
  const maxOutEdges =
    SYSTEM_LIMITS.relationships.maxOutgoingEdgesPerType || 100;
  const maxInEdges = SYSTEM_LIMITS.relationships.maxIncomingEdgesPerType || 100;

  if (countOutgoing >= maxOutEdges) {
    logger.warn("Maximum outgoing edges reached", {
      fromId: bufferFromId.toString("hex"),
      relationshipType,
      countOutgoing,
      maxOutEdges,
    });
    return {
      valid: false,
      message: translate("entity_rel.err_max_edge_out", { max: maxOutEdges }),
    };
  }

  if (countIncomming >= maxInEdges) {
    logger.warn("Maximum incoming edges reached", {
      toId: bufferToId.toString("hex"),
      relationshipType,
      countIncomming,
      maxInEdges,
    });
    return {
      valid: false,
      message: translate("entity_rel.err_max_edge_in", { max: maxInEdges }),
    };
  }

  logger.debug("Edge validation passed", {
    fromId: bufferFromId.toString("hex"),
    toId: bufferToId.toString("hex"),
    relationshipType,
  });
  return { valid: true };
};
