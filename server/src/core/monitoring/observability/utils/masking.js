/**
 * maskSensitiveData
 *
 * Recursively masks sensitive fields in an object or array.
 * Useful for logging, telemetry, or API responses where sensitive data should not be exposed.
 *
 * @param {Object|Array} obj - The object or array to process
 * @param {string[]} maskFields - List of keys to mask
 * @returns {Object|Array} - New object/array with sensitive fields masked
 *
 * @example
 * const data = {
 *   username: "johndoe",
 *   password: "secret123",
 *   profile: { email: "john@example.com" }
 * };
 *
 * const masked = maskSensitiveData(data, ["password", "email"]);
 * console.log(masked);
 * // { username: 'johndoe', password: '***MASKED***', profile: { email: '***MASKED***' } }
 */
export function maskSensitiveData(obj, maskFields = []) {
  // If it's null or not an object, return as-is
  if (obj === null || typeof obj !== "object") return obj;

  // If it's a Buffer, Date, RegExp, or similar, return as-is
  if (Buffer.isBuffer(obj) || obj instanceof Date || obj instanceof RegExp)
    return obj;

  // Only clone objects/arrays to mask nested fields
  const clone = Array.isArray(obj) ? [] : {};

  for (const key of Object.keys(obj)) {
    if (maskFields.includes(key)) {
      // Mask only if the key is in maskFields
      clone[key] = "***MASKED***";
    } else {
      // Leave everything else unchanged
      const value = obj[key];

      // If the value is an object/array, recurse
      if (
        value &&
        typeof value === "object" &&
        !Buffer.isBuffer(value) &&
        !(value instanceof Date) &&
        !(value instanceof RegExp)
      ) {
        clone[key] = maskSensitiveData(value, maskFields);
      } else {
        // Primitive or special type, leave as-is
        clone[key] = value;
      }
    }
  }

  return clone;
}
