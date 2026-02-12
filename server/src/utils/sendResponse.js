import { HTTP_STATUS } from "./statusCode.js";

/**
 * Generates a unique code based on the provided code and response type.
 * The response type can either be 'success' or 'error', and it will generate
 * a prefixed code accordingly.
 *
 * @param {string} code - The base code (e.g., "OTP_SENT", "USER_REGISTERED")
 * @param {string} [responseType=status.SUCCESS] - The response type ("success" or "error")
 *
 * @returns {string} A formatted unique code, such as "SECU-IN-OTP_SENT" or "SECU-ER-USER_REGISTERED"
 */
const getUniqueCode = (code, responseType = status.SUCCESS) => {
  const _responseType = status.ERROR === responseType ? "ER" : "IN";
  return `SECU-${_responseType}-${code}`;
};

/**
 * Sends a response to the client with a structured payload.
 *
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Object} payload - The response data
 *   @param {string} [payload.status=status.SUCCESS] - Response status ("success", "error", "info", "redirect")
 *   @param {number} [payload.code=HTTP_STATUS.x2_OK] - HTTP status code
 *   @param {string} [payload.message="N/A"] - Response message
 *   @param {any} [payload.data=null] - Response data
 *   @param {string} [payload.uniqueCode="N/A"] - A unique code for the response
 *   @param {string} [payload.redirectUrl=null] - URL to redirect to (if status is "redirect")
 *
 * @returns {Object} The JSON response sent to the client
 */
const send = (req, res, payload = {}) => {
  const ctx = req.context;

  const {
    status: _status = status.SUCCESS,
    code = HTTP_STATUS.x2_OK,
    message = "N/A",
    data = null,
    uniqueCode = "N/A",
    redirectUrl = null,
  } = payload;

  // Handle redirects
  if (_status === "redirect" && redirectUrl) {
    return res.redirect(code, redirectUrl);
  }

  const _uniqueCode = getUniqueCode(uniqueCode, _status);

  // Send JSON response
  return res.status(code).json({
    status: _status,
    code,
    message,
    uniqueCode: _uniqueCode,
    ...(data !== null && { data }),
    meta: {
      requestId: ctx.requestId,
      ...(ctx.auditId && { auditId: ctx.auditId }),
    },
  });
};

/**
 * Sends an error response to the client.
 *
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {string} message - The error message to send
 * @param {string} uniqueCode - A unique code to track the error
 */
const error = (req, res, message, uniqueCode) => {
  send(
    req,
    res,
    struct(
      status.ERROR,
      HTTP_STATUS.x5_INTERNAL_SERVER_ERROR,
      message,
      uniqueCode,
    ),
  );
};

/**
 * Structures the response payload with a status, code, message, unique code, and optional data.
 *
 * @param {string} status - The response status ("success", "error", "info", etc.)
 * @param {number} code - The HTTP status code
 * @param {string} message - The response message
 * @param {string} uniqueCode - A unique code for the response
 * @param {any} [data=null] - Optional data for the response
 *
 * @returns {Object} The structured response object
 */
const struct = (status, code, message, uniqueCode, data = null) => {
  return { status, code, message, uniqueCode, data };
};

// Response status constants
const status = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  REDIRECT: "redirect",
};

// Exported response utilities
export const RESPONSE = {
  status,
  struct,
  error,
  send,
  getUniqueCode,
};
