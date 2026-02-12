import { UtilsValidator } from "#packages";
import { regEx } from "../regex/index.js";

/**
 * Validator helpers and keys extracted from UtilsValidator
 */
const { validatePayload, VALIDATOR_KEY: KEY } = UtilsValidator;

/**
 * Base validation schema shared across user-related flows.
 * Covers basic identity and contact fields.
 */
const schema = {
  fname: [KEY.required, KEY.string, [KEY.matches, regEx.fullname], KEY.safe],
  mname: [KEY.string, [KEY.matches, regEx.fullname], KEY.safe],
  lname: [KEY.string, [KEY.matches, regEx.fullname], KEY.safe],
  email: [KEY.required, KEY.string, KEY.email],
  username: [KEY.required, KEY.trim, KEY.string, KEY.username],
};

/**
 * Validates payload for sending OTP.
 * Ensures user identity and contact fields are valid
 * before triggering OTP delivery.
 *
 * @param {Object} payload - Incoming request payload
 * @returns {Promise<Object>} Validation result
 */
export const validateSendOtp = async (payload = {}) => {
  const { fname, mname = "", lname = "", email, username } = payload;

  // Normalize payload with defaults for optional fields
  const _payload = {
    fname,
    mname,
    lname,
    email,
    username,
  };

  return validatePayload(schema, _payload);
};

/**
 * Validates payload for user registration.
 * Extends the base schema with OTP and reservation token checks.
 *
 * @param {Object} payload - Incoming request payload
 * @returns {Promise<Object>} Validation result
 */
export const validateRegisterUser = async (payload = {}) => {
  const {
    fname,
    mname = "",
    lname = "",
    email,
    username,
    otp,
    reservationToken,
  } = payload;

  // Normalize payload with defaults for optional fields
  const _payload = {
    fname,
    mname,
    lname,
    email,
    username,
    otp,
    reservationToken,
  };

  /**
   * Extended schema for registration flow.
   * Includes OTP and reservation token validation.
   */
  const _schema = {
    ...schema,
    otp: [
      KEY.required,
      KEY.string,
      [KEY.minLength, 6],
      [KEY.maxLength, 6],
      [KEY.matches, regEx.numbers],
    ],

    // Reservation token: required UUID v4
    reservationToken: [KEY.required, KEY.string, [KEY.uuid, 4]],
  };

  return validatePayload(_schema, _payload);
};
