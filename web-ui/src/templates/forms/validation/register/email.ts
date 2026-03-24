import type { EmailConfig, EmailValue } from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.EMAIL as FormFieldType, {
  validateConfig: (field: EmailConfig) => ({ valid: true }),

  validateResponse: (field: EmailConfig, value: EmailValue) => {
    if (typeof value !== "string") {
      return { valid: false, error: "Email must be a string" };
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      return { valid: false, error: "Invalid email format" };
    }

    return { valid: true };
  },
});
