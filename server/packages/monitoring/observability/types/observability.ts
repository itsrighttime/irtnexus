import { FastifyReply, FastifyRequest } from "fastify";
import { BaseEmitter } from "../emitters/BaseEmitter";
import { MetricsCollector } from "../metrics/MetricsCollector";
import { PrometheusExporter } from "#packages/monitoring/metrics/PrometheusExporter.js";

export interface ObservabilityOptions {
  serviceName: string;
  environment: string;
  version: string;
  emitters?: BaseEmitter<any>[];
  metricsCollector?: MetricsCollector | null;
  prometheusExporter?: PrometheusExporter | null;
  maskFields?: string[];
  sampleRate?: number; // 0.0 to 1.0
}

export interface RequestContext {
  actor?: {
    tenantId?: string;
    userId?: string;
    userRole?: string;
  };
  requestId?: string;
  traceId?: string;
}

export interface LogRequestParams {
  req: FastifyRequest;
  res: FastifyReply;
  durationMs: number;
  error?: Error;
}

export interface BusinessEventParams {
  ctx?: RequestContext;
  name: string;
  metadata?: Record<string, unknown>;
  outcome?: { success?: boolean; [key: string]: unknown };
}

export interface AuditEventParams {
  ctx?: RequestContext;
  action: { name: string; type: string };
  resource?: Record<string, unknown>;
  outcome?: { success?: boolean; [key: string]: unknown };
  metadata?: Record<string, unknown>;
}

export interface SystemEventParams {
  name: string;
  metadata?: Record<string, unknown>;
  severity?: "INFO" | "WARN" | "ERROR";
}

export interface EventBase {
  audit?: boolean;
  actor?: RequestContext["actor"];
  resource?: Record<string, unknown>;
  request?: Record<string, string>;
  metadata?: Record<string, unknown>;
  performance?: Record<string, unknown>;
  outcome?: Record<string, unknown>;
  action?: { name: string; type?: string };
  eventType: string;
  eventVersion?: number;
  timestamp?: Date;
}
