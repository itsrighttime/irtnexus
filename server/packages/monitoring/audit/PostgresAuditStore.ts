import { DB_ENV as ENV } from "#configs";
import { Pool } from "pg";
import { logger } from "#utils";
import { randomUUID } from "crypto";
import { AuditEventInput, AuditHashRow, ChainedAuditEvent } from "../observability/types";

const DB_MAIN_CONFIG = {
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  database: ENV.DB_NAME,
  user: ENV.DB_AUDIT_USER,
  password: ENV.DB_AUDIT_USER_PASS,
  max: 10,
};

const pool = new Pool(DB_MAIN_CONFIG);

/**
 * PostgresAuditStore
 *
 * Persists audit events into PostgreSQL.
 * Designed for hash-chained audit logs.
 */
export class PostgresAuditStore {
  private pool = pool;

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
        id,
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
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20
      )
    `;

    const params = [
      event.id ?? randomUUID(),
      event.tenantId ?? null,
      event.accountId ?? null,
      event.userRole ?? null,
      event.eventType ?? "UNKNOWN",
      event.eventVersion ?? 1,
      event.requestId ?? null,
      event.traceId ?? null,
      event.httpMethod ?? null,
      event.httpPath ?? null,
      event.ipAddress ?? null,
      event.userAgent ?? null,
      event.resource ?? null,
      event.outcome ?? null,
      event.metadata ?? null,
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
