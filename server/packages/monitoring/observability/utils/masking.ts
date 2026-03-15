/**
 * maskSensitiveData
 *
 * Recursively masks sensitive fields in an object or array.
 * Useful for logging, telemetry, or API responses where sensitive data should not be exposed.
 *
 * @param obj - The object or array to process
 * @param maskFields - List of keys to mask
 * @returns New object/array with sensitive fields masked
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
export function maskSensitiveData<T extends Record<string, any> | any[]>(
  obj: T,
  maskFields: string[] = [],
): T {
  // If it's null or not an object, return as-is
  if (obj === null || typeof obj !== "object") return obj;

  // If it's a Buffer, Date, RegExp, or similar, return as-is
  if (Buffer.isBuffer(obj) || obj instanceof Date || obj instanceof RegExp) {
    return obj;
  }

  // Prepare clone (array or object)
  const clone: any = Array.isArray(obj) ? [] : {};

  for (const key of Object.keys(obj)) {
    const value = (obj as Record<string, any>)[key];

    if (maskFields.includes(key)) {
      clone[key] = "***MASKED***";
    } else if (
      value &&
      typeof value === "object" &&
      !Buffer.isBuffer(value) &&
      !(value instanceof Date) &&
      !(value instanceof RegExp)
    ) {
      // Recursively mask nested objects/arrays
      clone[key] = maskSensitiveData(value, maskFields);
    } else {
      // Primitive or special type, leave as-is
      clone[key] = value;
    }
  }

  return clone as T;
}
