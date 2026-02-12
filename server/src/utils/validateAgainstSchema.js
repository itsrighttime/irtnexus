/**
 * Validates an input configuration object against a schema and returns a validated configuration.
 * The schema defines the expected properties, their types, default values, and allowed values.
 *
 * @param {Object} inputConfig - The input configuration object to be validated.
 * @param {Object} schema - The schema that defines the rules for validation.
 * Each key in the schema object should correspond to a key in the inputConfig.
 * The schema defines the expected type, required status, default value, and allowed values for each key.
 *
 * @param {string} [path=""] - The current path in the schema, used for nested validation.
 * This is passed recursively for nested schema validation.
 * It defaults to an empty string when validating top-level properties.
 *
 * @throws {Error} Throws an error if validation fails (e.g., missing required field, type mismatch, invalid value).
 *
 * @returns {Object} The validated configuration object. If a property is missing, it will use the default value from the schema.
 *
 * @example
 * const config = {
 *   name: "John Doe",
 *   age: 30,
 *   tags: ["developer", "javascript"]
 * };
 *
 * const schema = {
 *   name: { type: "string", required: true },
 *   age: { type: "number", required: true, default: 18 },
 *   tags: { type: "array", allowed: ["developer", "designer", "manager"] }
 * };
 *
 * try {
 *   const validatedConfig = validateAgainstSchema(config, schema);
 *   console.log(validatedConfig);
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
export const validateAgainstSchema = (inputConfig, schema, path = "") => {
  const validatedConfig = {};

  for (const key in schema) {
    const rule = schema[key];
    const value = inputConfig[key];
    const currentPath = path ? `${path}.${key}` : key;

    // Handle required fields
    if (rule.required && (value === undefined || value === null)) {
      throw new Error(`Configuration error: '${currentPath}' is required.`);
    }

    // Apply default if not present
    let finalValue = value !== undefined ? value : rule.default;

    // Validate types
    if (finalValue !== undefined && finalValue !== null) {
      const expectedType = rule.type;

      if (expectedType === "array") {
        if (!Array.isArray(finalValue)) {
          throw new Error(
            `Configuration error: '${currentPath}' must be an array.`,
          );
        }
      } else if (expectedType === "object") {
        if (typeof finalValue !== "object" || Array.isArray(finalValue)) {
          throw new Error(
            `Configuration error: '${currentPath}' must be an object.`,
          );
        }
      } else if (typeof finalValue !== expectedType) {
        throw new Error(
          `Configuration error: '${currentPath}' must be a ${expectedType}.`,
        );
      }
    }

    // Validate allowed values
    if (rule.allowed && !rule.allowed.includes(finalValue)) {
      throw new Error(
        `Configuration error: '${currentPath}' must be one of: ${rule.allowed.join(
          ", ",
        )}.`,
      );
    }

    // Validate nested schema
    if (rule.type === "object" && rule.schema) {
      finalValue = validateAgainstSchema(
        finalValue || {},
        rule.schema,
        currentPath,
      );
    }

    validatedConfig[key] = finalValue;
  }

  return validatedConfig;
};
