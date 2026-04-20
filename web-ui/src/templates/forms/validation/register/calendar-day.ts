import type { DateValue, DayPickerConfig } from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";
import { toDate } from "../helper/isValidDate";

engine.register(FORM_FIELDS_TYPE.DAY, {
  validateConfig: (field: DayPickerConfig) => {
    return { valid: true };
  },

  validateResponse: (field: DayPickerConfig, value: string) => {
    const pattern = /^\d{2}-\d{2}-\d{4}$/;

    if (!pattern.test(value)) {
      return { valid: false, error: "Invalid day format" };
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
