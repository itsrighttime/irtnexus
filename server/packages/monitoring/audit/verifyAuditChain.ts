import crypto from "crypto";
import { AuditLog, AuditVerificationResult } from "../observability/types";

/**
 * Deterministic JSON serialization.
 * Ensures object keys are sorted so hashing is stable.
 */
function stableStringify(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

/**
 * Computes a SHA-256 hash for an audit event.
 * Excludes the `hash` field itself to prevent circular dependency.
 */
export function computeAuditHash(event: AuditLog): string {
  const { hash, ...payload } = event;

  return crypto
    .createHash("sha256")
    .update(stableStringify(payload))
    .digest("hex");
}

/**
 * Verifies a segment of an audit log chain.
 */
export function verifyAuditChain({
  logs,
  startIndex = 0,
  expectedPreviousHash = "GENESIS",
}: {
  logs: AuditLog[];
  startIndex?: number;
  expectedPreviousHash?: string;
}): AuditVerificationResult {
  let previousHash = expectedPreviousHash;

  for (let i = startIndex; i < logs.length; i++) {
    const log = logs[i];

    // 1️⃣ verify linkage
    if (log.previousHash !== previousHash) {
      return {
        valid: false,
        index: i,
        reason: "PREVIOUS_HASH_MISMATCH",
        expected: previousHash,
        found: log.previousHash,
        log,
      };
    }

    // 2️⃣ recompute hash
    const computedHash = computeAuditHash(log);

    if (computedHash !== log.hash) {
      return {
        valid: false,
        index: i,
        reason: "HASH_MISMATCH",
        expected: computedHash,
        found: log.hash,
        log,
      };
    }

    previousHash = log.hash as string;
  }

  return {
    valid: true,
    verifiedFrom: startIndex,
    lastHash: previousHash,
    message: "Audit chain segment is valid",
  };
}

/**
 * Verify a single audit log against its predecessor.
 */
export function verifySingleAuditLog(
  log: AuditLog,
  previousLog: AuditLog,
): { valid: boolean; reason?: string } {
  if (log.previousHash !== previousLog.hash) {
    return { valid: false, reason: "BROKEN_LINK" };
  }

  const computed = computeAuditHash(log);

  if (computed !== log.hash) {
    return { valid: false, reason: "HASH_TAMPERED" };
  }

  return { valid: true };
}
