// emitters/MySQLAuditEmitter.js
import { BaseEmitter } from "./BaseEmitter.js";

/**
 * MySQLAuditEmitter
 *
 * Immutable audit emitter that stores events in a MySQL audit log.
 * Combines cryptographic chaining (AuditChain) with persistent storage (MySQLAuditStore).
 *
 * Inherits from BaseEmitter and implements the required emit() method.
 */
export class MySQLAuditEmitter extends BaseEmitter {
  /**
   * @param {Object} options
   * @param {AuditChain} options.auditChain - Responsible for generating the chained hash for immutability
   * @param {MySQLAuditStore} options.store - Responsible for persisting the audit events in MySQL
   */
  constructor({ auditChain, store }) {
    super();
    this.auditChain = auditChain;
    this.store = store;
  }

  /**
   * Emit an audit event by chaining it and storing it in MySQL
   *
   * @param {Object} event - Structured audit event
   * @returns {Promise<void>}
   */
  async emit(event) {
    // 1. Generate cryptographic hash chain
    const chainedEvent = await this.auditChain.chain(event);

    // 2. Persist the chained event to MySQL
    await this.store.append(chainedEvent);
  }
}
