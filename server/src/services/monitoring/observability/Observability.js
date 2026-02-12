import crypto from "crypto";
import { EVENT_TYPES } from "./constants.js";
import { maskSensitiveData } from "./utils/masking.js";
import { ACTION, HEADERS } from "#config";

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

    // List of configured event emitters (Console, Kafka, MySQLAudit, HTTP, etc.)
    this.emitters = emitters;

    // Optional metrics collector (business / performance metrics)
    this.metrics = metricsCollector;

    // Optional Prometheus integration
    this.prometheus = prometheusExporter;

    // Fields to mask in events
    this.maskFields = maskFields;

    // Sampling rate for non-audit events (0.0 to 1.0)
    this.sampleRate = sampleRate;
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

    this.logEvent({
      eventType: success
        ? EVENT_TYPES.REQUEST_COMPLETED
        : EVENT_TYPES.REQUEST_FAILED,
      audit: false,
      action: { name: ACTION.NAME.LOG, type: ACTION.TYPE.LOG },

      actor: ctx.actor,
      request: {
        requestId: ctx.requestId,
        traceId: ctx.traceId,
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers[HEADERS.USER_AGENT],
      },
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

    this.logEvent({
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
  logAuditEvent({ ctx, action, resource, outcome, metadata = {} }) {
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

    this.logEvent({
      eventType: EVENT_TYPES.ACCESS_EVENT,
      audit: true,
      action: { ...action, type: action.type || ACTION.TYPE.ACCESS },
      actor: ctx?.actor,
      resource,
      request: this.#extractRequestFromContext(ctx),
      metadata: {
        auditId: ctx?.auditId,
        requestId: ctx?.requestId,
        traceId: ctx?.traceId,
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

    this.logEvent({
      eventType: EVENT_TYPES.SYSTEM_EVENT,
      audit: false,
      action: { name, type: ACTION.TYPE.SYSTEM },
      metadata,
      severity,
      outcome: { success: true },
    });
  }

  /* =========================
     Core Event Pipeline
  ========================== */

  /**
   * Sends the event through all configured emitters.
   * Applies sampling and masking.
   *
   * @param {Object} event
   */
  logEvent(event) {
    if (!this.#shouldSample(event)) return;

    const enriched = this.#enrichEvent(event);
    const safeEvent = maskSensitiveData(enriched, this.maskFields);

    for (const emitter of this.emitters) {
      setImmediate(async () => {
        try {
          await emitter.emit(safeEvent);
        } catch (err) {
          // Observability must never crash the app
          console.error("Observability emitter failure:", err);
        }
      });
    }
  }

  /* =========================
     Internals
  ========================== */

  #shouldSample(event) {
    if (event.audit) return true;
    return Math.random() <= this.sampleRate;
  }

  #enrichEvent(event) {
    return {
      eventId: crypto.randomUUID(),
      eventType: event.eventType,
      eventVersion: 1,
      timestamp: new Date().toISOString().replace("T", " ").replace("Z", ""),

      context: {
        service: this.serviceName,
        environment: this.environment,
        version: this.version,
      },

      actor: event.actor || { anonymous: true },
      request: event.request || {},
      action: event.action || {},
      resource: event.resource || {},
      metadata: event.metadata || {},
      performance: event.performance || {},
      outcome: event.outcome || {},

      audit: Boolean(event.audit),
      severity: event.severity || null,

      previousHash: event.previousHash || null,
      hash: event.hash || null,
    };
  }

  #extractRequestFromContext(ctx) {
    if (!ctx) return {};
    return {
      requestId: ctx.requestId,
      traceId: ctx.traceId,
    };
  }

  #serializeError(error) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
    };
  }
}
