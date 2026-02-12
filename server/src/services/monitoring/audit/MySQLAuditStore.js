import { DatabaseFactory } from "#database";
import { logger } from "#utils";

/**
 * MySQLAuditStore
 *
 * Persists audit events into MySQL.
 * Designed to work with a hash-chained audit payload
 * to provide tamper-evident audit logs.
 */
export class MySQLAuditStore {
  /**
   * Creates a new audit store instance.
   * Uses a dedicated audit database user.
   */
  constructor() {
    // Database instance scoped for audit logging
    this.pool = DatabaseFactory.userAudit();
  }

  /**
   * Appends a new audit event to the audit_logs table.
   *
   * @param {Object} event - Fully constructed audit event
   * @returns {Promise<void>}
   */
  async append(event) {
    /**
     * SQL insert statement.
     * Column order must strictly match the params array below.
     */
    const sql = `
    INSERT INTO audit_logs (
      event_id,
      event_type,
      event_version,
      timestamp,

      actor_user_id,
      actor_role,
      actor_anonymous,

      request_id,
      trace_id,
      http_method,
      http_path,
      ip_address,
      user_agent,

      action,
      resource,
      metadata,
      performance,
      outcome,
      context,

      audit,
      previous_hash,
      hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    // Debug-level logging for audit persistence (no mutations)
    logger.debug("MySQL Audit Store [APPEND] :", {
      eventId: event.eventId || null,
      eventType: event.eventType || null,
      eventVersion: event.eventVersion || null,
      timestamp: event.timestamp || null,

      userId: event.actor?.userId || null,
      role: event.actor?.role || null,
      anonymous: event.actor?.anonymous || false,

      requestId: event.request?.requestId || null,
      traceId: event.request?.traceId || null,
      method: event.request?.method || null,
      path: event.request?.path || null,
      ip: event.request?.ip || null,
      userAgent: event.request?.userAgent || null,

      action: JSON.stringify(event.action || {}),
      resource: JSON.stringify(event.resource || {}),
      metadata: JSON.stringify(event.metadata || {}),
      performance: JSON.stringify(event.performance || {}),
      outcome: JSON.stringify(event.outcome || {}),
      context: JSON.stringify(event.context || {}),

      audit: event.audit || null,
      previousHash: event.previousHash || null,
      hash: event.hash || null,
    });

    /**
     * Parameter list for prepared statement execution.
     * JSON fields are stringified before persistence.
     */
    const params = [
      event.eventId,
      event.eventType,
      event.eventVersion,
      event.timestamp,

      event.actor?.userId || null,
      event.actor?.role || null,
      event.actor?.anonymous || false,

      event.request?.requestId || null,
      event.request?.traceId || null,
      event.request?.method || null,
      event.request?.path || null,
      event.request?.ip || null,
      event.request?.userAgent || null,

      JSON.stringify(event.action || {}),
      JSON.stringify(event.resource || {}),
      JSON.stringify(event.metadata || {}),
      JSON.stringify(event.performance || {}),
      JSON.stringify(event.outcome || {}),
      JSON.stringify(event.context || {}),

      // Indicates whether this event participates in audit chaining
      !!event.audit,
      event.previousHash,
      event.hash,
    ];

    // Persist the audit log entry
    await this.pool.execute(sql, params);
  }
}
