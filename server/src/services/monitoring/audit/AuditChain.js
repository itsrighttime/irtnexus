// audit/AuditChain.js
import { DatabaseFactory } from "#database";
import { logger } from "#utils";
import crypto from "crypto";

/**
 * Database connection used for audit logging.
 * Uses a privileged/admin user to ensure immutability guarantees.
 */
const auditUser = DatabaseFactory.userAudit();

/**
 * Fetches the hash of the most recent audit log entry.
 * Used to link the next audit event in the chain.
 *
 * @returns {Promise<string|undefined>} Last stored hash
 */
const getLastHash = async () => {
  const [row] = await auditUser.query(
    "SELECT hash FROM audit_logs ORDER BY id DESC LIMIT 1",
  );
  return row?.hash;
};

/**
 * AuditChain
 *
 * Implements a tamper-evident audit log using a hash chain.
 * Each audit event includes the hash of the previous event,
 * making historical modification detectable.
 */
export class AuditChain {
  constructor() {
    /**
     * Hash of the previous audit entry.
     * Initialized lazily from the database.
     *
     * @type {string|null}
     */
    this.lastHash = null;
  }

  /**
   * Initializes the audit chain.
   * Loads the most recent hash from storage or
   * falls back to a GENESIS value.
   *
   * @returns {Promise<void>}
   */
  async init() {
    this.lastHash = (await getLastHash()) || "GENESIS";
  }

  /**
   * Chains a new audit event.
   *
   * - Appends the previous hash
   * - Computes a SHA-256 hash of the payload
   * - Updates internal chain state
   *
   * @param {Object} event - Audit event data
   * @returns {Promise<Object>} Chained audit payload with hash
   */
  async chain(event) {
    // Lazy initialization to ensure chain continuity
    if (!this.lastHash) {
      await this.init();
    }

    /**
     * Payload used for hashing.
     * Including the previous hash creates a linked chain.
     */
    const payload = {
      ...event,
      previousHash: this.lastHash,
    };

    // Compute deterministic hash for the audit event
    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex");

    // Verbose logging for audit chain verification/debugging
    logger.verbose("DDDD [AuditChain Chain]", {
      hash,
      lastHash: this.lastHash,
    });

    // Update chain state for the next event
    this.lastHash = hash;

    return {
      ...payload,
      hash,
    };
  }
}
