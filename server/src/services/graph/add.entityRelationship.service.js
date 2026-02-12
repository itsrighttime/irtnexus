import {
  executeAction,
  generateBinaryUUID,
  hexToBinary,
  HTTP_STATUS,
  RESPONSE,
} from "#utils";
import { validateConstraints } from "./validation/constraintValidation.js";
import { validateEdge } from "./validation/edgeValidation.js";
import { entityRelationshipQuery as ERQ } from "#queries";
import { wouldCreateCycle } from "./validation/cycleDetection.js";
import { ACTION } from "#config";
import { translate } from "#translations";
import { logger } from "#utils";

/**
 * Executes the actual logic to add a relationship between two entities.
 *
 * @param {import('express').Request} req - Express request object
 * @param {object} payload - Validated payload
 */
export const addRelationship = async (req, payload) =>
  executeAction({
    req,
    action: { name: ACTION.NAME.ENTITY_REL_ADD, type: ACTION.TYPE.ENTITY },
    resource: {},
    handler: async () => {
      const { fromId, toId, relationshipType, constraints } = payload;

      logger.debug("Preparing to add relationship", {
        fromId,
        toId,
        relationshipType,
      });

      const bufferFromId = hexToBinary(fromId);
      const bufferToId = hexToBinary(toId);

      // Validate that the edge is allowed
      const edgeValidation = await validateEdge(
        bufferFromId,
        bufferToId,
        relationshipType,
      );
      if (!edgeValidation.valid) {
        logger.warn("Edge validation failed", {
          fromId,
          toId,
          relationshipType,
        });
        return RESPONSE.struct(
          RESPONSE.status.ERROR,
          HTTP_STATUS.x4_FAILED_DEPENDENCY,
          edgeValidation.message,
          "00024",
          {},
        );
      }

      // Validate constraints
      const constraintValidation = await validateConstraints(
        bufferFromId,
        bufferToId,
        relationshipType,
      );
      if (!constraintValidation.valid) {
        logger.warn("Constraint validation failed", {
          fromId,
          toId,
          relationshipType,
        });
        return RESPONSE.struct(
          RESPONSE.status.ERROR,
          HTTP_STATUS.x4_FAILED_DEPENDENCY,
          constraintValidation.message,
          "00025",
          {},
        );
      }

      // Prevent cycles
      if (await wouldCreateCycle(bufferFromId, bufferToId)) {
        logger.warn("Cycle detected", { fromId, toId });
        return RESPONSE.struct(
          RESPONSE.status.ERROR,
          HTTP_STATUS.x4_FAILED_DEPENDENCY,
          translate("entity_rel.err_cycle"),
          "00026",
          {},
        );
      }

      const id = generateBinaryUUID();
      await ERQ.insertRelationship({
        id,
        fromId: bufferFromId,
        toId: bufferToId,
        type: relationshipType,
        constraints,
      });

      logger.info("Relationship successfully added", {
        fromId,
        toId,
        relationshipType,
        id,
      });
      return RESPONSE.struct(
        RESPONSE.status.SUCCESS,
        HTTP_STATUS.x2_OK,
        translate("entity_rel.entity_rel_created"),
        "00027",
        {},
      );
    },
  });
