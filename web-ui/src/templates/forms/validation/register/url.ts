import type { URLFieldConfig, URLFieldValue } from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.URL as FormFieldType, {
  validateConfig: (field: URLFieldConfig) => {
    // Currently, no extra validation for URL config
    return { valid: true };
  },

  validateResponse: (field: URLFieldConfig, value: URLFieldValue) => {
    if (typeof value !== "string") {
      return { valid: false, error: "Must be a string" };
    }

    const trimmed = value.trim();

    // URL format validation
    try {
      const url = new URL(trimmed);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return { valid: false, error: "Invalid URL protocol" };
      }
    } catch {
      return { valid: false, error: "Invalid URL format" };
    }

    return { valid: true };
  },
});
