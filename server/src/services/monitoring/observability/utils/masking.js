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
  if (obj === null || typeof obj !== "object") return obj;

  const clone = Array.isArray(obj) ? [] : {};

  for (const key of Object.keys(obj)) {
    if (maskFields.includes(key)) {
      clone[key] = "***MASKED***";
    } else {
      // Recursively mask nested objects/arrays
      clone[key] = maskSensitiveData(obj[key], maskFields);
    }
  }

  return clone;
}
