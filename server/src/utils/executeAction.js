import crypto from "crypto";
import { observability } from "#services";
import { logger } from "./logger.js";
import { RESPONSE } from "./sendResponse.js";

/**
 * Executes a business action with logging, audit, and observability.
 *
 * Wraps a handler function with:
 *  - Operational logging (via Winston)
 *  - Audit logging (immutable)
 *  - Duration measurement
 *  - Automatic UUID-based auditId
 *
 * @param {Object} params
 *   @property {Object} req - Express request object (expects `req.context`)
 *   @property {Object} action - Action metadata
 *     @property {string} name - Action name (e.g., "REGISTER_SEND_OTP")
 *     @property {string} type - Action type (e.g., "auth", "system")
 *   @property {Object} resource - Resource being acted on
 *     @property {string} type - Resource type
 *     @property {string|number} id - Resource identifier
 *   @property {Function} handler - Async function to execute
 *     Receives `req.context` and returns a result object
 *
 * @returns {Promise<any>} Returns the result of the handler function
 *
 * @throws {Error} Throws the original error if the handler fails
 *
 * @example
 * await executeAction({
 *   req,
 *   action: { name: "REGISTER_SEND_OTP", type: "auth" },
 *   resource: { type: "User", id: userId },
 *   handler: async (ctx) => {
 *     // perform business logic
 *     return { status: 200, message: "OTP sent", uniqueCode: "OTP123" };
 *   }
 * });
 */
export const executeAction = async ({ req, action, resource, handler }) => {
  const ctx = req.context;

  // Lazily generate a unique auditId if not already present
  if (!ctx.auditId) {
    ctx.auditId = crypto.randomUUID();
  }

  const startedAt = Date.now();
  let result;

  try {
    // Execute the business handler
    result = await handler(ctx);

    const durationMs = Date.now() - startedAt;

    // Operational logging (Winston)
    logger.verbose("Action succeeded", {
      requestId: ctx.requestId,
      traceId: ctx.traceId,
      auditId: ctx.auditId,
      action,
      resource,
      actor: ctx.actor,
      durationMs,
    });

    // Immutable audit logging
    observability.logAuditEvent({
      action,
      actor: ctx.actor,
      resource,
      outcome: {
        success: true,
        durationMs,
        uniqueCode: RESPONSE.getUniqueCode(result?.uniqueCode, result.status),
        message: result?.message,
      },
      metadata: {
        auditId: ctx.auditId,
        requestId: ctx.requestId,
        traceId: ctx.traceId,
      },
    });

    return result;
  } catch (error) {
    const durationMs = Date.now() - startedAt;

    // Log the failure with detailed error info
    logger.error({
      message: "Action failed",
      requestId: ctx.requestId,
      traceId: ctx.traceId,
      auditId: ctx.auditId,
      action,
      resource,
      actor: ctx.actor,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });

    // Record failed audit event
    observability.logAuditEvent({
      action,
      actor: ctx.actor,
      resource,
      outcome: {
        success: false,
        durationMs,
        error: {
          name: error.name,
          message: error.message,
        },
        uniqueCode: RESPONSE.getUniqueCode(result?.uniqueCode, result?.status),
      },
      metadata: {
        auditId: ctx.auditId,
        requestId: ctx.requestId,
        traceId: ctx.traceId,
      },
    });

    throw error; // Propagate the original error
  }
};
