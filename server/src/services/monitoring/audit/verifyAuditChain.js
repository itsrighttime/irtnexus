import crypto from "crypto";

/**
 * Computes a SHA-256 hash for an audit event.
 * Excludes the `hash` field itself to prevent circular dependency.
 *
 * @param {Object} event - Audit event object
 * @returns {string} SHA-256 hex digest
 */
export function computeAuditHash(event) {
  // Destructure hash out to avoid including it in the new computation
  const { hash, ...payload } = event;

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(payload)) // deterministic JSON serialization
    .digest("hex");
}

/**
 * Verifies a segment of an audit log chain.
 *
 * Steps:
 * 1. Ensure `previousHash` links match sequentially.
 * 2. Recompute each log's hash and compare to stored `hash`.
 *
 * @param {Object} params
 * @param {Array<Object>} params.logs - Array of audit logs to verify
 * @param {number} [params.startIndex=0] - Index in logs to start verification
 * @param {string} [params.expectedPreviousHash="GENESIS"] - Hash prior to startIndex
 *
 * @returns {Object} Verification result with `valid` boolean and details
 */
export function verifyAuditChain({
  logs,
  startIndex = 0,
  expectedPreviousHash = "GENESIS",
}) {
  let previousHash = expectedPreviousHash;

  for (let i = startIndex; i < logs.length; i++) {
    const log = logs[i];

    // 1 Check previousHash linkage
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

    // 2 Recompute hash and compare
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

    // Update previousHash for next iteration
    previousHash = log.hash;
  }

  return {
    valid: true,
    verifiedFrom: startIndex,
    lastHash: previousHash,
    message: "Audit chain segment is valid",
  };
}

/**
 * Optional utility: verify a single log against its immediate predecessor.
 *
 * @param {Object} log - Current audit log
 * @param {Object} previousLog - Previous audit log
 * @returns {Object} Verification result `{ valid: boolean, reason?: string }`
 */
export function verifySingleAuditLog(log, previousLog) {
  if (log.previousHash !== previousLog.hash) {
    return { valid: false, reason: "BROKEN_LINK" };
  }

  const computed = computeAuditHash(log);
  if (computed !== log.hash) {
    return { valid: false, reason: "HASH_TAMPERED" };
  }

  return { valid: true };
}

/* 
  Usage Examples:

  // Verify logs by ID range
  const logs = await db.query(`
    SELECT * FROM audit_logs
    WHERE id >= 10000
    ORDER BY id ASC
  `);

  const previousLog = await db.query(`
    SELECT hash FROM audit_logs
    WHERE id = 9999
  `);

  const result = verifyAuditChain({
    logs,
    expectedPreviousHash: previousLog.hash,
  });
  console.log(result);

  // Verify logs by timestamp range
  const logs = await db.query(`
    SELECT * FROM audit_logs
    WHERE timestamp BETWEEN ? AND ?
    ORDER BY id ASC
  `);

  const prev = await db.query(`
    SELECT hash FROM audit_logs
    WHERE id < ?
    ORDER BY id DESC
    LIMIT 1
  `);

  verifyAuditChain({
    logs,
    expectedPreviousHash: prev?.hash || "GENESIS",
  });
*/
