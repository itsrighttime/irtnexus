import { userService } from "#services";
import { HTTP_STATUS, logger, RESPONSE } from "#utils";
import { validateRegUser } from "#validations";

const { registerUserStep1, registerUserStep2 } = userService;
const { validateRegisterUser, validateSendOtp } = validateRegUser;

/**
 * Controller to initiate user registration by sending an OTP.
 * Validates input payload and triggers step 1 of registration flow.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} HTTP response
 */
export const sendOTPController = async (req, res) => {
  const requestId = req.id || Date.now(); // simple correlation ID
  logger.debug("sendOTPController called", { requestId, body: req.body });

  try {
    // Validate incoming request payload
    const validate = await validateSendOtp(req.body);
    logger.debug("Payload validation result", { requestId, validate });

    if (!validate.valid) {
      logger.warn("Validation failed for sendOTPController", {
        requestId,
        errors: validate,
      });
      const payload = RESPONSE.struct(
        RESPONSE.status.ERROR,
        HTTP_STATUS.x4_BAD_REQUEST,
        "",
        "0001C", // Validation error code
        validate,
      );
      return RESPONSE.send(req, res, payload);
    }

    const { fname, mname, lname, email, username } = validate.value;
    logger.info("Validation passed, proceeding to registerUserStep1", {
      requestId,
      email,
      username,
    });

    const result = await registerUserStep1(req, {
      fname,
      mname,
      lname,
      email,
      username,
    });
    logger.info("registerUserStep1 completed", {
      requestId,
      email,
      username,
      resultStatus: result.status,
    });

    return RESPONSE.send(req, res, result);
  } catch (err) {
    logger.error(`Unexpected error in sendOTPController : ${requestId}`);
    logger.error(err);
    return RESPONSE.error(req, res, err.message, "0001A");
  }
};

/**
 * Controller to complete user registration.
 * Validates OTP and reservation token, then creates the user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} HTTP response
 */
export const registerUserController = async (req, res) => {
  const requestId = req.id || Date.now();
  logger.debug("registerUserController called", { requestId, body: req.body });

  try {
    const validate = await validateRegisterUser(req.body);
    logger.debug("Payload validation result", { requestId, validate });

    if (!validate.valid) {
      logger.warn("Validation failed for registerUserController", {
        requestId,
        errors: validate,
      });
      const payload = RESPONSE.struct(
        RESPONSE.status.ERROR,
        HTTP_STATUS.x4_BAD_REQUEST,
        "",
        "0001D",
        validate,
      );
      return RESPONSE.send(req, res, payload);
    }

    const { fname, mname, lname, email, otp, username, reservationToken } =
      validate.value;
    logger.info("Validation passed, proceeding to registerUserStep2", {
      requestId,
      email,
      username,
      reservationToken,
    });

    const result = await registerUserStep2(req, {
      fname,
      mname,
      lname,
      email,
      otp,
      username,
      reservationToken,
    });
    logger.info("registerUserStep2 completed", {
      requestId,
      email,
      username,
      resultStatus: result.status,
    });

    return RESPONSE.send(req, res, result);
  } catch (err) {
    logger.error(`Unexpected error in registerUserController : ${requestId}`);
    logger.error(err);

    return RESPONSE.error(req, res, err.message, "0001B");
  }
};
