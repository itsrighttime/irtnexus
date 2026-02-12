import crypto from "crypto";
import { observability } from "#services";
import { HEADERS } from "#config";
import { logger } from "#utils";

/**
 * Request Context Middleware
 *
 * Attaches a request-scoped context object to `req`
 * and wires observability hooks (metrics + logging)
 * for the full request lifecycle.
 *
 * Responsibilities:
 * - Generate/request IDs for tracing
 * - Initialize audit & actor context
 * - Measure request duration
 * - Emit metrics and structured logs on response finish
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export const requestContextMiddleware = (req, res, next) => {
  // Capture request start time
  const startTime = Date.now();

  /**
   * Attach context to request.
   * This object can be enriched downstream
   * (e.g. auth middleware, audit logging).
   */
  req.context = {
    // Prefer upstream request ID if present
    requestId: req.id || crypto.randomUUID(),

    // Trace ID from headers or generate a new one
    traceId: req.headers[HEADERS.TRACEPARENT] || crypto.randomUUID(),

    // Lazily initialized when audit logging is required
    auditId: null,

    // Default actor context (updated after auth)
    actor: { anonymous: true },

    startTime,
  };

  // Verbose logging for debugging request context propagation
  logger.verbose("[Request Context Middleware] :", req.context);

  // Notify observability layer that a request has started
  observability.prometheus?.startRequest();

  /**
   * Hook into response completion to emit metrics and logs.
   * This runs regardless of success or failure.
   */
  res.on("finish", () => {
    const durationMs = Date.now() - startTime;

    // Record Prometheus metrics
    observability.prometheus?.endRequest({
      method: req.method,
      endpoint: req.route?.path || req.originalUrl || "unknown",
      statusCode: res.statusCode,
      durationMs,
    });

    // Centralized structured request logging
    observability.logRequest({
      req,
      res,
      durationMs,
      error: res.locals?.error,
    });
  });

  next();
};
