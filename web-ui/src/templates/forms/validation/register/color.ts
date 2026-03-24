import type { ColorConfig, ColorValue } from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.COLOR as FormFieldType, {
  validateConfig: (field: ColorConfig) => ({ valid: true }),

  validateResponse: (field: ColorConfig, value: ColorValue) => {
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (typeof value !== "string" || !regex.test(value)) {
      return { valid: false, error: "Invalid hex color code" };
    }
    return { valid: true };
  },
});
