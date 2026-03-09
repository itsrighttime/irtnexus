import { DatabaseFactory } from "#database";
import { bufferToUUID, generateBinaryUUID, logger } from "#utils";

/**
 * MySQLAuditStore
 *
 * Persists audit events into MySQL.
 * Designed to work with a hash-chained audit payload
 * to provide tamper-evident audit logs.
 */
export class MySQLAuditStore {
  constructor() {
    // Database instance scoped for audit logging
    this.pool = DatabaseFactory.userAudit();
  }

  /**
   * Appends a new audit event to the audit_logs table.
   *
   * @param {Object} event - Fully constructed audit event
   * @param {Buffer|string} event.id - Primary key (BINARY(16))
   * @param {Buffer|string} event.tenantId
   * @param {Buffer|string} [event.userId]
   * @param {string} [event.userRole]
   * @param {string} event.eventType
   * @param {number} [event.eventVersion=1]
   * @param {Buffer|string} [event.requestId]
   * @param {Buffer|string} [event.traceId]
   * @param {string} [event.httpMethod]
   * @param {string} [event.httpPath]
   * @param {string} [event.ipAddress]
   * @param {string} [event.userAgent]
   * @param {string} [event.resourceTable]
   * @param {Buffer|string} [event.resourceId]
   * @param {Buffer|string} [event.historyId]
   * @param {Object} [event.outcome]
   * @param {Object} [event.metadata]
   * @param {Object} [event.performance]
   * @param {boolean} [event.audit=true]
   * @param {string} [event.previousHash]
   * @param {string} [event.hash]
   * @param {Date} [event.timestamp=new Date()]
   */
  async append(event) {

    console.log("DDDD : MYSQL Audit Store Append")


    const sql = `
      INSERT INTO audit_logs (
        id,
        tenant_id,
        user_id,
        user_role,
        event_type,
        event_version,
        request_id,
        trace_id,
        http_method,
        http_path,
        ip_address,
        user_agent,
        resource_table,
        resource_id,
        history_id,
        outcome,
        metadata,
        performance,
        audit,
        previous_hash,
        hash,
        timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      event.id ?? generateBinaryUUID(),
      event.tenantId ?? null,
      event.userId ?? null,
      event.userRole ?? null,
      event.eventType ?? "UNKNOWN",
      event.eventVersion ?? 1,
      event.requestId ?? null,
      event.traceId ?? null,
      event.httpMethod ?? null,
      event.httpPath ?? null,
      event.ipAddress ?? null,
      event.userAgent ?? null,
      event.resourceTable ?? null,
      event.resourceId ?? null,
      event.historyId ?? null,
      event.outcome ? JSON.stringify(event.outcome) : null,
      event.metadata ? JSON.stringify(event.metadata) : null,
      event.performance ? JSON.stringify(event.performance) : null,
      event.audit ?? true,
      event.previousHash ?? null,
      event.hash ?? null,
      event.timestamp ?? new Date(),
    ];


    logger.debug("MySQLAuditStore [APPEND]:", {
      id: params[0] && bufferToUUID(params[0]),
      tenantId: params[1] && bufferToUUID(params[1]),
      userId: params[2] && bufferToUUID(params[2]),
      eventType: params[4],
      resourceTable: params[12],
      resourceId: params[13] && bufferToUUID(params[13]),
      historyId: params[14] && bufferToUUID(params[14]),
      timestamp: params[21],
    });

    await this.pool.execute(sql, params);
  }
}
