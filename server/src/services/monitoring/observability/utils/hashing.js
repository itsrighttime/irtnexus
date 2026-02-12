import crypto from "crypto";

/**
 * hashEvent
 *
 * Computes a SHA-256 hash of a given event object.
 * Useful for audit chains, immutability checks, or tamper detection.
 *
 * @param {Object} event - The event payload to hash
 * @returns {string} - The hexadecimal SHA-256 hash of the event
 *
 * @example
 * const event = { id: 1, action: "CREATE_USER" };
 * const hash = hashEvent(event);
 * console.log(hash); // e.g., "3a7bd3e2360a8f..."
 */
export function hashEvent(event) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(event))
    .digest("hex");
}
