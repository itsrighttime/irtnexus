import type { DateValue, YearPickerConfig } from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";
import { isValidDate, toDate } from "../helper/isValidDate";

engine.register(FORM_FIELDS_TYPE.YEAR, {
  validateConfig: () => ({ valid: true }),

  validateResponse: (field: YearPickerConfig, value: string) => {
    const pattern = /^\d{4}$/;

    if (!pattern.test(value)) {
      return { valid: false, error: "Invalid year format" };
    }

    const yyyy = Number(value);

    if (yyyy < 1000 || yyyy > 9999) {
      return { valid: false, error: "Invalid year" };
    }

    return { valid: true };
  },
});
