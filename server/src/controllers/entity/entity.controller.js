import { graphService } from "#services";
import { HTTP_STATUS, logger, RESPONSE } from "#utils";
import { validateEntity } from "#validations";

export const createEntity = async (req, res) => {
  try {
    // Validate incoming request payload
    const validate = await validateEntity.createEntity(req.body);

    // Return validation error response if payload is invalid
    if (!validate.valid) {
      const payload = RESPONSE.struct(
        RESPONSE.status.ERROR,
        HTTP_STATUS.x4_BAD_REQUEST,
        "",
        "0001E", // Validation error code
        validate,
      );
      return RESPONSE.send(req, res, payload);
    }

    // Extract validated and sanitized values
    const { name, type, meta } = validate.value;

    // Trigger registration step 1 (OTP generation & delivery)
    const result = await graphService.createEntity(req, { name, type, meta });

    return RESPONSE.send(req, res, result);
  } catch (err) {
    // Log unexpected errors for debugging/monitoring
    logger.error(err);

    // Send standardized error response
    return RESPONSE.error(req, res, err.message, "0001F");
  }
};

export const updateEntity = async (req, res) => {
  try {
    // Validate incoming request payload
    const validate = await validateEntity.updateEntity(req.body);

    // Return validation error response if payload is invalid
    if (!validate.valid) {
      const payload = RESPONSE.struct(
        RESPONSE.status.ERROR,
        HTTP_STATUS.x4_BAD_REQUEST,
        "",
        "00021", // Validation error code
        validate,
      );
      return RESPONSE.send(req, res, payload);
    } 

    // Extract validated and sanitized values
    const {
      id,
      name = undefined,
      meta = undefined,
      status = undefined,
    } = validate.value;

    // Trigger registration step 1 (OTP generation & delivery)
    const result = await graphService.updateEntity(req, {
      id,
      name,
      status,
      meta,
    });

    return RESPONSE.send(req, res, result);
  } catch (err) {
    // Log unexpected errors for debugging/monitoring
    logger.error(err);

    // Send standardized error response
    return RESPONSE.error(req, res, err.message, "00022");
  }
};
