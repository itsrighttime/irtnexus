import { isConditional } from "./isConditional";
import { pushError } from "./helper/errorFormatter";
import { FIELDS_PROPS as FPs } from "./helper/fields";
import { validationEngine as engine } from "./ValidationEngine";
import {
  type FormField,
  type FormResponse,
  type ValidateResult,
} from "../types/formConfig.types";
import type { ConditionalField } from "../types/register.types";

/**
 * Recursively validates a form response against its schema.
 * Supports:
 *  - repeatable and nested repeatable fields
 *  - conditional visibility
 *  - group and primitive fields
 */
export function validateResponse(
  schema: FormField[] = [],
  response: FormResponse = {},
  parentKey = "",
): ValidateResult {
  const errors: Record<string, any> = {};

  for (const field of schema) {
    const fieldName = field[FPs.NAME];
    const value = response?.[fieldName];
    const keyPath = parentKey ? `${parentKey}.${fieldName}` : fieldName;
    const conditionalFiled = field[FPs.CONDITIONAL];

    // --- CONDITIONAL VISIBILITY ---
    if (conditionalFiled) {
      const visible = isConditional(conditionalFiled, response);
      if (!visible) continue; // skip hidden fields
    }

    // --- EMPTY CHECKS ---
    const isEmpty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    // --- REPEATABLE FIELDS ---
    if (field[FPs.REPEATABLE]) {
      if (!Array.isArray(value)) {
        pushError(errors, field, `Must be an array ${keyPath}`);
        continue;
      }

      value.forEach((item, index) => {
        const nestedKey = `${keyPath}[${index}]`;
        const subResult = validateResponse(
          field[FPs.FIELDS] || [],
          item,
          nestedKey,
        );
        Object.assign(errors, subResult.errors);
      });

      continue;
    }

    // --- REQUIRED CHECK ---
    if (field[FPs.REQUIRED] && isEmpty) {
      pushError(errors, field, `This field is required ${keyPath}`);
      continue;
    }

    // --- OPTIONAL EMPTY SKIP ---
    if (!field[FPs.REQUIRED] && !field[FPs.REPEATABLE] && isEmpty) {
      continue;
    }

    const fields_ = field[FPs.FIELDS];

    // --- NESTED GROUPS ---
    if (Array.isArray(fields_) && fields_.length > 0) {
      const subResult = validateResponse(
        field[FPs.FIELDS],
        value || {},
        keyPath,
      );
      Object.assign(errors, subResult.errors);
      continue;
    }

    // --- SIMPLE FIELD VALIDATION ---
    const res = engine.validateResponse(field, value);
    if (!res.valid) pushError(errors, field, `${res.error} | ${keyPath}`);
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
