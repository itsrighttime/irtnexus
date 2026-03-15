import { FastifyRequest, FastifyReply } from "fastify";
import { EVENT_TYPES } from "./constants";
import { maskSensitiveData } from "./utils/masking";
import { ACTION, HEADERS } from "#configs";
import { generateUUID, logger } from "#utils";
import { BaseEmitter } from "./emitters/BaseEmitter";
import { MetricsCollector } from "./metrics/MetricsCollector";
import { PrometheusExporter } from "../metrics/PrometheusExporter";
import {
  AuditEventParams,
  BusinessEventParams,
  EventBase,
  LogRequestParams,
  ObservabilityOptions,
  RequestContext,
  SystemEventParams,
} from "./types/observability";
import { AuditEventInput } from "./types";

export class Observability {
  private serviceName: string;
  private environment: string;
  private version: string;
  private emitters: BaseEmitter<any>[];
  private metrics: MetricsCollector | null;
  private prometheus: PrometheusExporter | null;
  private maskFields: string[];
  private sampleRate: number;

  constructor({
    serviceName,
    environment,
    version,
    emitters = [],
    metricsCollector = null,
    maskFields = ["password", "token", "secret"],
    sampleRate = 1.0,
    prometheusExporter = null,
  }: ObservabilityOptions) {
    this.serviceName = serviceName;
    this.environment = environment;
    this.version = version;
    this.emitters = emitters;
    this.metrics = metricsCollector;
    this.prometheus = prometheusExporter;
    this.maskFields = maskFields;
    this.sampleRate = sampleRate;
  }

  /* =========================
     Public API
  ========================== */

  logRequest({ req, res, durationMs, error }: LogRequestParams): void {
    const ctx: RequestContext = (req as any).context || {};
    const success = !error && res.statusCode < 400;

    if (this.metrics) {
      this.metrics.recordRequest({
        endpoint: req.url || "unknown",
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
      request: this.extractRequestFromContext(ctx, req),
      performance: { durationMs },
      outcome: {
        success,
        statusCode: res.statusCode,
        error: error ? this.serializeError(error) : null,
      },
    });
  }

  logBusinessEvent({
    ctx,
    name,
    metadata = {},
    outcome = {},
  }: BusinessEventParams) {
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
      request: this.extractRequestFromContext(ctx),
      metadata,
      outcome,
    });
  }

  logAuditEvent({
    ctx = {},
    action,
    resource = {},
    outcome = {},
    metadata = {},
  }: AuditEventParams) {
    const success = outcome?.success === true;

    if (this.prometheus) {
      if (action.type === ACTION.TYPE.AUTH) {
        this.prometheus.recordAuthEvent({ type: action.name, success });
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
      request: this.extractRequestFromContext(ctx),
      metadata: { ...metadata },
      outcome,
    });
  }

  logSystemEvent({
    name,
    metadata = {},
    severity = "INFO",
  }: SystemEventParams) {
    if (this.prometheus) {
      this.prometheus.systemEventsTotal?.inc({ severity });
    }

    this.logEvent({
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

  private logEvent(event: EventBase): void {
    if (!this.shouldSample(event)) return;

    const enriched = this.enrichEvent(event);
    const safeEvent = maskSensitiveData(enriched, this.maskFields);

    for (const emitter of this.emitters) {
      setImmediate(async () => {
        try {
          await emitter.emit(safeEvent);
        } catch (err: any) {
          logger.error("Error: ", err);
        }
      });
    }
  }

  private shouldSample(event: EventBase): boolean {
    if (event.audit) return true;
    return Math.random() <= this.sampleRate;
  }

  private enrichEvent(event: EventBase): AuditEventInput & { id: string } {
    return {
      id: generateUUID(),
      tenantId: event.actor?.tenantId,
      userId: event.actor?.userId,
      userRole: event.actor?.userRole,
      eventType: event.eventType,
      eventVersion: event.eventVersion ?? 1,
      requestId: event.request?.requestId,
      traceId: event.request?.traceId,
      httpMethod: event.request?.method,
      httpPath: event.request?.path,
      ipAddress: event.request?.ip,
      userAgent: event.request?.userAgent,
      timestamp: event.timestamp ?? new Date(),
      audit: Boolean(event.audit),
      resource: event.resource,
      metadata: {
        ...event.metadata,
        service: this.serviceName,
        environment: this.environment,
        version: this.version,
        actionName: event.action?.name,
        actionType: event.action?.type,
      },
      performance: event.performance || {},
      outcome: event.outcome || {},
      action: event.action,
    };
  }

  private extractRequestFromContext(
    ctx?: RequestContext,
    req?: FastifyRequest,
  ): Record<string, any> {
    return {
      requestId: ctx?.requestId ?? req?.id,
      traceId: ctx?.traceId,
      method: req?.method,
      path: req?.url,
      ip: req?.ip,
      userAgent: req?.headers[HEADERS.USER_AGENT],
    };
  }

  private serializeError(error: Error): Record<string, any> {
    return {
      name: error.name,
      message: error.message,
      code: (error as any).code,
    };
  }
}
