import type {
  DatePickerConfig,
  DateValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE} from "../helper/fields";
import { isValidDate, toDate } from "../helper/isValidDate";

engine.register(FORM_FIELDS_TYPE.DATE, {
  validateConfig: (field: DatePickerConfig) => {
    if (!isValidDate(field[FPs.RESTRICTION_START_DATE] as any)) {
      return { valid: false, error: "Invalid start date" };
    }

    if (!isValidDate(field[FPs.RESTRICTION_END_DATE] as any)) {
      return { valid: false, error: "Invalid end date" };
    }

    return { valid: true };
  },

  validateResponse: (field: DatePickerConfig, value: DateValue) => {
    const pattern = /^\d{2}-\d{2}-\d{4}$/;

    if (!pattern.test(value)) {
      return { valid: false, error: "Invalid date format" };
    }

    const valDate = toDate(value);

    const start = field[FPs.RESTRICTION_START_DATE];
    if (start && valDate < toDate(start)) {
      return { valid: false, error: "Before allowed range" };
    }

    const end = field[FPs.RESTRICTION_END_DATE];
    if (end && valDate > toDate(end)) {
      return { valid: false, error: "After allowed range" };
    }

    return { valid: true };
  },
});