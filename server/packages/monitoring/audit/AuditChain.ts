import { logger } from "#utils";
import crypto from "crypto";
import { PostgresAuditStore } from "./PostgresAuditStore";
import { AuditEvent, ChainedAuditEvent } from "../observability/types";

const getLastHash = new PostgresAuditStore().getLastHash;

/**
 * Creates deterministic JSON for hashing.
 * Prevents hash mismatch due to key ordering.
 */
function stableStringify(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

/**
 * AuditChain
 *
 * Implements a tamper-evident audit log using a hash chain.
 * Each audit event includes the hash of the previous event,
 * making historical modification detectable.
 */
export class AuditChain {
  /**
   * Hash of the previous audit entry.
   */
  private lastHash: string | null = null;

  /**
   * Initializes the audit chain.
   * Loads the most recent hash from storage or
   * falls back to a GENESIS value.
   */
  async init(): Promise<void> {
    this.lastHash = (await getLastHash()) ?? "GENESIS";
  }

  /**
   * Chains a new audit event.
   *
   * - Appends the previous hash
   * - Computes a SHA-256 hash of the payload
   * - Updates internal chain state
   */
  async chain<T extends AuditEvent>(event: T): Promise<T & ChainedAuditEvent> {
    if (!this.lastHash) {
      await this.init();
    }

    const payload = {
      ...event,
      previousHash: this.lastHash as string,
    };

    const hash = crypto
      .createHash("sha256")
      .update(stableStringify(payload))
      .digest("hex");

    logger.verbose("[AuditChain] chained event", {
      hash,
      previousHash: this.lastHash,
    });

    this.lastHash = hash;

    return {
      ...payload,
      hash,
    };
  }
}
