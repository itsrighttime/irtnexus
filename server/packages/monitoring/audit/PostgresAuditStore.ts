import { DB_ENV as ENV } from "#configs";
import { Pool } from "pg";
import { logger, uuidToBuffer } from "#utils";
import {
  AuditEventInput,
  AuditHashRow,
  ChainedAuditEvent,
} from "../observability/types";

const DB_MAIN_CONFIG = {
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  database: ENV.DB_NAME,
  user: ENV.DB_AUDIT_USER,
  password: ENV.DB_AUDIT_USER_PASS,
  max: 10,
};

/**
 * PostgresAuditStore
 *
 * Persists audit events into PostgreSQL.
 * Designed for hash-chained audit logs.
 */
export class PostgresAuditStore {
  private pool = new Pool(DB_MAIN_CONFIG);

  async getLastHash(): Promise<string | undefined> {
    const { rows } = await this.pool.query<AuditHashRow>(
      `SELECT hash FROM audit_logs ORDER BY id DESC LIMIT 1`,
    );

    return rows?.[0]?.hash;
  }

  /**
   * Appends a new audit event to audit_logs.
   */
  async append(event: ChainedAuditEvent): Promise<void> {
    const sql = `
      INSERT INTO audit_logs (
        tenant_id,
        account_id,
        user_role,
        event_type,
        event_version,
        request_id,
        trace_id,
        http_method,
        http_path,
        ip_address,
        user_agent,
        resource,
        outcome,
        metadata,
        performance,
        audit,
        previous_hash,
        hash,
        timestamp
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19
      )
    `;

    const params = [
      event.tenantId ? uuidToBuffer(event.tenantId as string) : null,
      event.accountId ? uuidToBuffer(event.accountId as string) : null,
      event.userRole ?? null,
      event.eventType ?? "UNKNOWN",
      event.eventVersion ?? 1,
      event.accountId ? uuidToBuffer(event.requestId as string) : null,
      event.accountId ? uuidToBuffer(event.traceId as string) : null,
      event.httpMethod ?? null,
      event.httpPath ?? null,
      event.ipAddress ?? null,
      event.userAgent ?? null,
      event.resource ?? null,
      event.outcome ?? null,
      { ...(event.metadata || {}), eventId: event.id },
      event.performance ?? null,
      event.audit ?? true,
      event.previousHash ?? null,
      event.hash ?? null,
      event.timestamp ?? new Date(),
    ];

    logger.debug("PostgresAuditStore [APPEND]", {
      id: params[0],
      tenantId: params[1],
      accountId: params[2],
      eventType: params[4],
      timestamp: params[19],
    });

    await this.pool.query(sql, params);
  }
}
