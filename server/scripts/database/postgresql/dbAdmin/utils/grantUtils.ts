/**
 * Normalize a SQL GRANT statement
 *
 * Extracts the granted privileges from a raw GRANT statement by:
 * 1. Removing the "GRANT" keyword at the beginning.
 * 2. Removing the "TO <user>" clause at the end.
 * 3. Trimming any leading/trailing whitespace.
 *
 * Example:
 *   Input: { someKey: "GRANT SELECT, INSERT ON mydb.* TO 'user'@'%'" }
 *   Output: "SELECT, INSERT ON mydb.*"
 *
 * @param {object} grant - Object containing the GRANT statement as a value
 * @returns {string} - Normalized privileges string
 */
export function normalizeGrant(grant: string): string {
  return grant
    .replace(/^GRANT\s+/i, "")
    .replace(/\s+TO\s+.*/i, "")
    .trim();
}
