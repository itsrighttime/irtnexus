import type { PasswordConfig, PasswordValue } from "../../types/register.types";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";
import { validationEngine as engine } from "../ValidationEngine";

engine.register(FORM_FIELDS_TYPE.PASSWORD as FormFieldType, {
  validateConfig: (field: PasswordConfig) => ({ valid: true }),

  validateResponse: (field: PasswordConfig, value: PasswordValue) => {
    if (typeof value !== "string") {
      return { valid: false, error: "Password must be a string" };
    }

    // Example rule: at least 6 characters, must contain a number
    if (value.length < 6) {
      return { valid: false, error: "Password must be at least 6 characters" };
    }

    if (!/\d/.test(value)) {
      return {
        valid: false,
        error: "Password must contain at least one number",
      };
    }

    return { valid: true };
  },
});
