import type {
  MobileFieldConfig,
  MobileValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.MOBILE as FormFieldType, {
  validateConfig: (field: MobileFieldConfig) => {
    if (field[FPs.CODE] !== undefined && typeof field[FPs.CODE] !== "string") {
      return { valid: false, error: "Country code must be a string" };
    }
    return { valid: true };
  },

  validateResponse: (field: MobileFieldConfig, value: MobileValue) => {
    if (typeof value !== "object" || value === null) {
      return {
        valid: false,
        error: "Mobile value must be an object with code and number",
      };
    }

    const { [FPs.CODE]: code, [FPs.NUMBER]: number } = value;

    // Validate country code
    if (!code || typeof code !== "string" || !/^\+\d{1,4}$/.test(code)) {
      return { valid: false, error: "Invalid country code" };
    }

    // Validate mobile number
    if (!number || typeof number !== "string" || !/^\d{7,15}$/.test(number)) {
      return { valid: false, error: "Invalid mobile number format" };
    }

    return { valid: true };
  },
});
