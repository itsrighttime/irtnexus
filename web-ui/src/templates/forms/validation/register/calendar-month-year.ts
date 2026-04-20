import type {
  DateValue,
  MonthYearPickerConfig,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";
import { isValidDate, toDate } from "../helper/isValidDate";

engine.register(FORM_FIELDS_TYPE.MONTH_YEAR, {
  validateConfig: (field: MonthYearPickerConfig) => {
    return { valid: true };
  },

  validateResponse: (field: MonthYearPickerConfig, value: string) => {
    const pattern = /^\d{2}-\d{4}$/;

    if (!pattern.test(value)) {
      return { valid: false, error: "Invalid month-year format" };
    }

    const [mm, yyyy] = value.split("-").map(Number);

    if (mm < 1 || mm > 12) {
      return { valid: false, error: "Invalid month" };
    }

    if (yyyy < 1000 || yyyy > 9999) {
      return { valid: false, error: "Invalid year" };
    }

    return { valid: true };
  },
});
