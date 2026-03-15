import { logger } from "#utils";
import crypto from "crypto";
import { PostgresAuditStore } from "./PostgresAuditStore";
import { AuditEvent, ChainedAuditEvent } from "../observability/types";

/** Creates deterministic JSON for hashing */
function stableStringify(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

export class AuditChain {
  private lastHash: string | null = null;
  private store: PostgresAuditStore;

  constructor(store: PostgresAuditStore) {
    this.store = store; // Injected instance
  }

  async init(): Promise<void> {
    this.lastHash = (await this.store.getLastHash()) ?? "GENESIS";
  }

  async chain<T extends AuditEvent>(event: T): Promise<T & ChainedAuditEvent> {
    if (!this.lastHash) await this.init();

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

    return { ...payload, hash };
  }
}
