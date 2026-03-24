import type { FormConfig, FormField } from "../types/formConfig.types.js";
import { FIELDS_PROPS } from "./helper/fields.js";

export const configToSchema = (config?: FormConfig): FormField[] => {
  if (!config) return [];

  // Check if it's a multi-step form
  if ("step" in config && Array.isArray(config.step)) {
    // Flatten all step fields into one array
    return config.step.flatMap((_step) => _step[FIELDS_PROPS.FIELDS] ?? []);
  }

  // Single-step form: TypeScript now knows 'fields' exists
  return "fields" in config && Array.isArray(config.fields)
    ? config.fields
    : [];
};
