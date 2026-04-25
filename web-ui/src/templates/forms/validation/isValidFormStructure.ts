import { FIELDS_PROPS as FPs, FORM_FIELDS_TYPE } from "./helper/fields.js";
import { OPERATORS } from "./helper/operators.js";
import type {
  FormConfig,
  FormField,
  MultiStepFormConfig,
  SingleStepFormConfig,
} from "../types/formConfig.types"; // Assuming we defined types earlier

/**
 * Validates the basic structure of a form config (single or multi-step)
 * Returns true if valid, false otherwise
 */
export function isValidFormStructure(config?: FormConfig): boolean {
  if (!config || typeof config !== "object") return false;

  // Required string fields
  const stringFields = [FPs.TITLE, FPs.DESCRIPTION, FPs.MODE] as const;
  for (const key of stringFields) {
    if (typeof config[key] !== "string") return false;
  }

  // --- Helper to validate a single field ---
  const validateField = (field: FormField | any): boolean => {
    if (!field || typeof field !== "object") return false;

    const hasName = !!field[FPs.NAME];
    const hasTypeOrRepeatable = !!field[FPs.TYPE] || !!field[FPs.REPEATABLE];
    const hasLabel = !!field[FPs.LABEL];

    if (!hasName || !hasTypeOrRepeatable || !hasLabel) return false;

    if (
      field[FPs.TYPE] &&
      !Object.values(FORM_FIELDS_TYPE).includes(field[FPs.TYPE])
    ) {
      return false;
    }

    if (field[FPs.CONDITIONAL]) {
      const cond = field[FPs.CONDITIONAL];
      const hasConditionalProps =
        cond[FPs.DEPENDS_ON] !== undefined &&
        cond[FPs.OPERATOR] !== undefined &&
        cond[FPs.VALUE] !== undefined;

      if (!hasConditionalProps) return false;
      if (!Object.values(OPERATORS).includes(cond[FPs.OPERATOR])) return false;
    }

    return true;
  };

  // Type-safe validation
  if (config[FPs.MODE] === "single") {
    // TS now knows this is SingleStepFormConfig
    const fields = (config as SingleStepFormConfig)[FPs.FIELDS];

    if (!Array.isArray(fields)) return false;
    if (!fields.every(validateField)) return false;
  }

  if (config[FPs.MODE] === "multi") {
    // TS now knows this is MultiStepFormConfig
    const steps = (config as MultiStepFormConfig)[FPs.STEP];
    if (!Array.isArray(steps)) return false;

    for (const step of steps) {
      if (!step || typeof step !== "object") return false;
      const stepFields = step[FPs.FIELDS];
      if (!Array.isArray(stepFields)) return false;
      if (!stepFields.every(validateField)) return false;
    }
  }

  return true;
}
