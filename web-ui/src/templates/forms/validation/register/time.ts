import type {
  TimeFieldConfig,
  TimeFieldValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.TIME as FormFieldType, {
  validateConfig: (field: TimeFieldConfig) => {
    // Currently, no extra validation for TIME config
    return { valid: true };
  },

  validateResponse: (field: TimeFieldConfig, value: TimeFieldValue) => {
    if (typeof value !== "string") {
      return { valid: false, error: "Time must be string" };
    }

    // Format: hh:mm AM/PM
    const regex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    if (!regex.test(value)) {
      return {
        valid: false,
        error: "Invalid time format (expected hh:mm AM/PM)",
      };
    }

    return { valid: true };
  },
});
