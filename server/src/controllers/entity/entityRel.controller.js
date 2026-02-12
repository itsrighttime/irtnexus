import { graphService } from "#services";
import { HTTP_STATUS, logger, RESPONSE } from "#utils";
import { validateEntity } from "#validations";

/**
 * HTTP controller for adding a relationship between two entities.
 *
 * Steps:
 * 1. Validate incoming payload.
 * 2. Return error if invalid.
 * 3. Extract validated fields.
 * 4. Call the graphService to persist the relationship.
 * 5. Return standardized response.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export const addRelationship = async (req, res) => {
  try {
    logger.debug("Validating addRelationship payload", { body: req.body });

    // Validate incoming request payload
    const validate = await validateEntity.addRelationship(req.body);

    // Return validation error response if payload is invalid
    if (!validate.valid) {
      const payload = RESPONSE.struct(
        RESPONSE.status.ERROR,
        HTTP_STATUS.x4_BAD_REQUEST,
        "Validation failed",
        "00028", // Validation error code
        validate,
      );

      logger.warn("addRelationship validation failed", { body: req.body });
      return RESPONSE.send(req, res, payload);
    }

    const { fromId, toId, relationshipType, constraints } = validate.value;
    logger.info("Payload validated successfully", {
      fromId,
      toId,
      relationshipType,
    });

    // Trigger the actual relationship addition
    const result = await graphService.addRelationship(req, {
      fromId,
      toId,
      relationshipType,
      constraints,
    });

    if (RESPONSE.status.SUCCESS)
      logger.info("Relationship added successfully", {
        fromId,
        toId,
        relationshipType,
      });
      
    return RESPONSE.send(req, res, result);
  } catch (err) {
    // Log unexpected errors
    logger.error(err);
    return RESPONSE.error(req, res, err.message, "00029");
  }
};
