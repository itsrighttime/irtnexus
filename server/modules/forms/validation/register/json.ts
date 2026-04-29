import type { JsonConfig, JsonValue } from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FORM_FIELDS_TYPE } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.JSON, {
  validateConfig: (field: JsonConfig) => ({ valid: true }),

  validateResponse: (field: JsonConfig, value: JsonValue) => {
    if (typeof value !== "string") {
      return { valid: false, error: "JSON must be string" };
    }

    try {
      JSON.parse(value);
      return { valid: true };
    } catch {
      return { valid: false, error: "Invalid JSON format" };
    }
  },
});
