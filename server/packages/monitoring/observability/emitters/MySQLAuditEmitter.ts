import { AuditChain } from "#packages/monitoring/audit/AuditChain.js";
import { PostgresAuditStore } from "#packages/monitoring/audit/PostgresAuditStore.js";
import { AuditEventInput, PostgresAuditEmitterOptions } from "../types";
import { BaseEmitter } from "./BaseEmitter";

/**
 * MySQLAuditEmitter
 *
 * Immutable audit emitter that:
 * 1. Generates a cryptographic hash chain (AuditChain)
 * 2. Persists events in MySQL (PostgresAuditStore)
 */
export class PostgresAuditEmitter extends BaseEmitter<AuditEventInput> {
  private auditChain: AuditChain;
  private store: PostgresAuditStore;

  constructor({ auditChain, store }: PostgresAuditEmitterOptions) {
    super();
    this.auditChain = auditChain;
    this.store = store;
  }

  /**
   * Emit an audit event:
   * - Chains it cryptographically
   * - Persists it to MySQL
   */
  async emit(event: AuditEventInput): Promise<void> {
    // 1️⃣ Generate cryptographic hash chain
    const chainedEvent = await this.auditChain.chain(event);

    // 2️⃣ Persist the chained event to MySQL
    await this.store.append(chainedEvent);
  }
}
