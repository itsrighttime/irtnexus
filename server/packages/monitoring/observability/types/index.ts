import { AuditChain } from "../../audit/AuditChain";
import { PostgresAuditStore } from "../../audit/PostgresAuditStore";

/**
 * Generic audit event structure.
 */
export interface AuditEvent {
  [key: string]: unknown;
}

/**
 * Event payload stored in the chain.
 */
export interface ChainedAuditEvent extends AuditEvent {
  previousHash: string;
  hash: string;
}

export interface AuditEventInput extends AuditEvent {
  id?: string;
  tenantId?: string | null;
  accountId?: string | null;
  userRole?: string | null;

  eventType: string;
  eventVersion?: number;

  requestId?: string | null;
  traceId?: string | null;

  httpMethod?: string | null;
  httpPath?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;

  resource?: unknown;
  outcome?: unknown;
  metadata?: unknown;
  performance?: unknown;

  audit?: boolean;
  previousHash?: string | null;
  hash?: string | null;

  timestamp?: Date;
}

export interface AuditHashRow {
  hash: string;
}

/**
 * Generic audit log structure
 */
export interface AuditLog {
  hash?: string;
  previousHash?: string;
  [key: string]: unknown;
}

export interface AuditVerificationSuccess {
  valid: true;
  verifiedFrom: number;
  lastHash: string;
  message: string;
}

export interface AuditVerificationFailure {
  valid: false;
  index: number;
  reason: "PREVIOUS_HASH_MISMATCH" | "HASH_MISMATCH";
  expected: string;
  found?: string;
  log: AuditLog;
}

export type AuditVerificationResult =
  | AuditVerificationSuccess
  | AuditVerificationFailure;

export interface PrometheusExporterOptions {
  port?: number;
  serviceName: string;
  environment: string;
}

export type StatusClass = "1xx" | "2xx" | "3xx" | "4xx" | "5xx";

export interface PostgresAuditEmitterOptions {
  auditChain: AuditChain;
  store: PostgresAuditStore;
}

export interface EndpointMetrics {
  count: number;
  success: number;
  failure: number;
  totalDuration: number;
}

export interface EndpointSnapshot {
  endpoint: string;
  requestCount: number;
  successRate: number;
  avgLatencyMs: number;
}

export interface RecordRequestParams {
  endpoint: string;
  success: boolean;
  durationMs: number;
}
