/**
 * Utility to safely extract rows from a DB query result
 * Supports both mysql2/promise ([rows, fields]) and other libraries returning array/object
 */
export function extractRows(result) {
  if (!result) return null;
  if (Array.isArray(result))
    return Array.isArray(result[0]) ? result[0] : result;
  return null;
}
