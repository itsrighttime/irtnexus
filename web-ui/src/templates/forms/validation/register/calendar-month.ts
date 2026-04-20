import type {
  DateValue,
  MonthPickerConfig,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";
import { isValidDate, toDate } from "../helper/isValidDate";

engine.register(FORM_FIELDS_TYPE.MONTH, {
  validateConfig: () => ({ valid: true }),

  validateResponse: (field: MonthPickerConfig, value: string) => {
    const pattern = /^\d{2}$/;

    if (!pattern.test(value)) {
      return { valid: false, error: "Invalid month format" };
    }

    const mm = Number(value);
    if (mm < 1 || mm > 12) {
      return { valid: false, error: "Invalid month value" };
    }

    return { valid: true };
  },
});
