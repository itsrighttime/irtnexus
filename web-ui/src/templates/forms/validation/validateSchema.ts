import { FIELDS_PROPS as FPs, FORM_FIELDS_TYPE } from "./helper/fields";
import { OPERATORS } from "./helper/operators";
import { validationEngine as engine } from "./ValidationEngine";
import { pushError } from "./helper/errorFormatter";
import { verifyFieldProps } from "./verifyFieldProps";
import type { FormField } from "../types/register.types";

interface ValidateSchemaResult {
  valid: boolean;
  errors: Record<string, any>;
}

/**
 * Recursively validates a form schema:
 *  - Ensures unique field names
 *  - Checks required properties: name, label, type
 *  - Validates repeatable fields
 *  - Validates conditional rules
 *  - Uses engine.validateConfig for type-specific checks
 */
export const validateSchema = (
  schema: FormField[],
  parentNames = new Set<string>(),
): ValidateSchemaResult => {
  const seenNames = new Set([...parentNames]);
  const errors: Record<string, any> = {};

  for (const field of schema) {
    verifyFieldProps(field, errors);

    const {
      [FPs.NAME]: name,
      [FPs.LABEL]: label,
      [FPs.TYPE]: type,
      [FPs.REPEATABLE]: repeatable,
      [FPs.FIELDS]: fields,
      [FPs.MORE_LABEL]: moreLabel,
      [FPs.CONDITIONAL]: conditional,
    } = field;

    // --- Generic props ---
    if (!name || typeof name !== "string") {
      pushError(errors, field, `Invalid or missing "name"`);
    }

    if (seenNames.has(name)) {
      pushError(errors, field, `Duplicate field name`);
    }
    seenNames.add(name);

    if (!label || typeof label !== "string") {
      pushError(errors, field, `Missing or invalid "label"`);
    }

    // --- Repeatable handling ---
    if (repeatable) {
      if (!Array.isArray(fields) || fields.length === 0) {
        pushError(errors, field, `Repeatable field must define child fields`);
      }

      if (!moreLabel) {
        pushError(errors, field, `Repeatable field must define "moreLabel"`);
      }

      const childResult = validateSchema(fields || [], seenNames);
      Object.assign(errors, childResult.errors);
    } else {
      if (!type || !Object.values(FORM_FIELDS_TYPE).includes(type)) {
        pushError(errors, field, `Invalid or missing "type"`);
      }
    }

    // --- Conditional rules ---
    if (conditional) {
      const {
        [FPs.DEPENDS_ON]: dependsOn,
        [FPs.OPERATOR]: operator,
        [FPs.VALUE]: value,
      } = conditional ?? {};

      if (!dependsOn || typeof dependsOn !== "string") {
        pushError(errors, field, `conditional.dependsOn must be a string`);
      }

      if (!operator || !Object.values(OPERATORS).includes(operator)) {
        pushError(errors, field, `conditional.operator must be valid`);
      }

      if (!Array.isArray(value)) {
        pushError(errors, field, `conditional.value must be an array`);
      }

      if (!dependsOn || !seenNames.has(dependsOn)) {
        pushError(
          errors,
          field,
          `conditional.dependsOn "${dependsOn}" not found in schema`,
        );
      }
    }

    // --- Field-specific validation ---
    if (!repeatable && field.type) {
      const result = engine.validateConfig(
        field as typeof field & { type: string },
      );
      if (!result.valid)
        pushError(errors, field, result.error || "General Repeatable Error");
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
};
