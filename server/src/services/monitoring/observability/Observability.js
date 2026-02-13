import crypto from "crypto";
import { EVENT_TYPES } from "./constants.js";
import { maskSensitiveData } from "./utils/masking.js";
import { ACTION, HEADERS } from "#config";
import { bufferToUUID, generateBinaryUUID, logger } from "#utils";

/**
 * Observability
 *
 * Centralized logging, auditing, and metrics for services.
 * Supports:
 * - HTTP request logging
 * - Business events
 * - Audit events (immutable)
 * - System events
 * - Prometheus integration for metrics
 * - Sensitive data masking
 */
export class Observability {
  constructor({
    serviceName,
    environment,
    version,
    emitters = [],
    metricsCollector = null,
    maskFields = ["password", "token", "secret"],
    sampleRate = 1.0,
    prometheusExporter = null,
  }) {
    this.serviceName = serviceName;
    this.environment = environment;
    this.version = version;

    this.emitters = emitters; // List of configured event emitters (Console, Kafka, MySQLAudit, HTTP, etc.)
    this.metrics = metricsCollector; // Optional metrics collector (business / performance metrics)
    this.prometheus = prometheusExporter; // Optional Prometheus integration
    this.maskFields = maskFields; // Fields to mask in events
    this.sampleRate = sampleRate; // Sampling rate for non-audit events (0.0 to 1.0)
  }

  /* =========================
     Public APIs
  ========================== */

  /**
   * Logs infrastructure-level HTTP requests.
   * Called once per request.
   *
   * @param {Object} params
   * @param {Object} params.req - Express request object
   * @param {Object} params.res - Express response object
   * @param {number} params.durationMs - Request duration in milliseconds
   * @param {Error} [params.error] - Optional error object
   */
  logRequest({ req, res, durationMs, error }) {
    const ctx = req.context || {};
    const success = !error && res.statusCode < 400;

    if (this.metrics) {
      this.metrics.recordRequest({
        endpoint: req.route?.path || req.originalUrl || "unknown",
        success,
        durationMs,
      });
    }

    this.#logEvent({
      eventType: success
        ? EVENT_TYPES.REQUEST_COMPLETED
        : EVENT_TYPES.REQUEST_FAILED,
      audit: false,
      action: { name: ACTION.NAME.LOG, type: ACTION.TYPE.LOG },

      actor: ctx.actor,
      request: this.#extractRequestFromContext(ctx, req),
      performance: { durationMs },
      outcome: {
        success,
        statusCode: res.statusCode,
        error: error ? this.#serializeError(error) : null,
      },
    });
  }

  /**
   * Logs domain-level business events (non-audit).
   *
   * @param {Object} params
   * @param {Object} params.ctx - Request context
   * @param {string} params.name - Business event name
   * @param {Object} [params.metadata] - Additional metadata
   * @param {Object} [params.outcome] - Event outcome, e.g., { success: true }
   */
  logBusinessEvent({ ctx, name, metadata = {}, outcome = {} }) {
    if (this.prometheus) {
      this.prometheus.recordBusinessEvent({
        name,
        success: outcome.success === true,
      });
    }

    this.#logEvent({
      eventType: EVENT_TYPES.BUSINESS_EVENT,
      audit: false,
      action: { name, type: ACTION.TYPE.BUSINESS },
      actor: ctx?.actor,
      request: this.#extractRequestFromContext(ctx),
      metadata,
      outcome,
    });
  }

  /**
   * Logs immutable audit events (used for security, compliance, or access tracking).
   *
   * @param {Object} params
   * @param {Object} params.ctx - Request context
   * @param {Object} params.action - Action performed
   * @param {Object} params.resource - Resource acted upon
   * @param {Object} params.outcome - Outcome (success/failure)
   * @param {Object} [params.metadata] - Additional metadata
   */
  logAuditEvent({
    ctx = {},
    action,
    resource = {},
    outcome = {},
    metadata = {},
  }) {
    const success = outcome?.success === true;

    if (this.prometheus) {
      if (action.type === ACTION.TYPE.AUTH) {
        this.prometheus.recordAuthEvent({
          type: action.name,
          success,
        });
      } else if (!success) {
        this.prometheus.accessDeniedTotal?.inc();
      }
    }

    this.#logEvent({
      eventType: EVENT_TYPES.ACCESS_EVENT,
      audit: true,
      action: { ...action, type: action.type || ACTION.TYPE.ACCESS },
      actor: ctx?.actor,
      resource,
      request: this.#extractRequestFromContext(ctx),
      metadata: {
        ...metadata,
      },
      outcome,
    });
  }

  /**
   * Logs system-level events like errors, warnings, and alerts.
   *
   * @param {Object} params
   * @param {string} params.name - Event name
   * @param {Object} [params.metadata] - Additional metadata
   * @param {string} [params.severity="INFO"] - Severity level
   */
  logSystemEvent({ name, metadata = {}, severity = "INFO" }) {
    if (this.prometheus) {
      this.prometheus.systemEventsTotal?.inc({ severity });
    }

    this.#logEvent({
      eventType: EVENT_TYPES.SYSTEM_EVENT,
      audit: false,
      action: { name, type: ACTION.TYPE.SYSTEM },
      metadata: { ...metadata, severity },
      outcome: { success: true },
    });
  }

  /* =========================
     Core Event Pipeline
  ========================== */
  /**
   * Logs an event to all configured emitters after sampling, enriching, and masking sensitive data.
   *
   * @param {Object} event - The raw event object to log. Expected structure:
   *   @property {boolean} [audit] - If true, event is always logged, bypassing sampling.
   *   @property {Object} [resource] - Resource related info.
   *     @property {string} resourceTable - Table name of the resource.
   *     @property {string} resourceId - ID of the resource.
   *     @property {string} historyId - Optional history ID for versioned resources.
   *   @property {Object} [actor] - User or system actor generating the event.
   *     @property {string} tenantId - Tenant or organization identifier.
   *     @property {string} userId - User identifier.
   *     @property {string} userRole - Role of the actor.
   *   @property {string} eventType - Type of the event (e.g., "login", "update").
   *   @property {number} [eventVersion] - Version of the event schema. Defaults to 1.
   *   @property {Object} request - Request context for the event.
   *     @property {string} requestId - Unique request identifier.
   *     @property {string} traceId - Trace identifier for distributed tracing.
   *     @property {string} method - HTTP method.
   *     @property {string} path - HTTP path.
   *     @property {string} ip - IP address of the requester.
   *     @property {string} userAgent - User agent string from headers.
   *   @property {string} [severity] - Optional severity level of the event.
   *   @property {Date} [timestamp] - Event timestamp. Defaults to `new Date()`.
   *   @property {boolean} [audit] - Forces logging regardless of sampling.
   *   @property {Object} [metadata] - Extra metadata for the event.
   *   @property {Object} [performance] - Performance metrics related to the event.
   *   @property {Object} [outcome] - Outcome details (success/failure etc.).
   *   @property {Object} [action] - Action details.
   *     @property {string} name - Name of the action.
   *     @property {string} type - Type of action.
   */
  #logEvent(event) {
    if (!this.#shouldSample(event)) return; // Skip event if it doesn't pass sampling

    // Enrich event with additional system and contextual info
    const enriched = this.#enrichEvent(event);

    // Mask sensitive fields before sending to emitters
    const safeEvent = maskSensitiveData(enriched, this.maskFields);

    // Send event asynchronously to all emitters
    for (const emitter of this.emitters) {
      setImmediate(async () => {
        try {
          await emitter.emit(safeEvent);
        } catch (err) {
          // Observability must never crash the app
          logger.error(err);
        }
      });
    }
  }

  /* =========================
   Internals
========================== */

  /**
   * Determines if the event should be sampled/logged.
   *
   * @param {Object} event - The event object
   * @returns {boolean} - true if event should be logged
   */
  #shouldSample(event) {
    if (event.audit) return true; // Always log audited events
    return Math.random() <= this.sampleRate; // Log based on configured sampling rate
  }

  /**
   * Enriches the event with additional system, actor, request, and metadata info.
   *
   * @param {Object} event - Original event object
   * @returns {Object} enrichedEvent - Event object with added contextual data
   */
  #enrichEvent(event) {
    return {
      id: generateBinaryUUID(), // Unique event ID

      // Actor info
      tenantId: event.actor?.tenantId,
      userId: event.actor?.userId,
      userRole: event.actor?.userRole,

      // Event metadata
      eventType: event.eventType,
      eventVersion: event.eventVersion ?? 1,

      // Request context
      requestId: event.request.requestId,
      traceId: event.request.traceId,
      httpMethod: event.request.method,
      httpPath: event.request.path,
      ipAddress: event.request.ip,
      userAgent: event.request.userAgent,

      timestamp: event.timestamp ?? new Date(),
      audit: Boolean(event.audit),

      resource: event.resource,
      metadata:
        {
          ...event.metadata,
          service: this.serviceName,
          environment: this.environment,
          version: this.version,
          actionName: event.action?.name,
          actionType: event.action?.type,
        } || {},
      performance: event.performance || {},
      outcome: event.outcome || {},
    };
  }

  /**
   * Extracts request info from a context object (e.g., a web request).
   *
   * @param {Object} ctx - Context object (may be undefined)
   * @returns {Object} requestData - Extracted request info
   *   @property {string} requestId
   *   @property {string} traceId
   *   @property {string} method
   *   @property {string} path
   *   @property {string} ip
   *   @property {string} userAgent
   */
  #extractRequestFromContext(ctx, req = {}) {
    if (!ctx) return {};

    return {
      requestId: ctx.requestId,
      traceId: ctx.traceId,
      method: req?.method,
      path: req?.originalUrl,
      ip: req?.ip,
      userAgent: req?.headers[HEADERS.USER_AGENT],
    };
  }

  /**
   * Serializes an error object for logging or telemetry.
   *
   * @param {Error} error - The error object to serialize
   * @returns {Object} serializedError
   *   @property {string} name - Error name
   *   @property {string} message - Error message
   *   @property {string} code - Optional error code
   */
  #serializeError(error) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
    };
  }
}
