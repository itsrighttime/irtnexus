import type {
  DateFieldConfig,
  DateMode,
  DateValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.DATE as FormFieldType, {
  validateConfig: (field: DateFieldConfig) => {
    const modes: DateMode[] = ["date", "month", "month-year", "year"];
    const pattern = /^\d{2}-\d{2}-\d{4}$/;

    const modeValue = field[FPs.MODE]; // possibly undefined
    if (modeValue !== undefined && !modes.includes(modeValue)) {
      return { valid: false, error: "Invalid mode" };
    }

    const checkDate = (dateStr?: string) => {
      if (!dateStr) return true;
      if (!pattern.test(dateStr)) return false;

      const [dd, mm, yyyy] = dateStr.split("-").map(Number);
      return (
        yyyy >= 1000 &&
        yyyy <= 9999 &&
        mm >= 1 &&
        mm <= 12 &&
        dd >= 1 &&
        dd <= new Date(yyyy, mm, 0).getDate()
      );
    };

    if (!checkDate(field[FPs.RESTRICTION_START_DATE])) {
      return { valid: false, error: "Invalid start date" };
    }
    if (!checkDate(field[FPs.RESTRICTION_END_DATE])) {
      return { valid: false, error: "Invalid end date" };
    }

    return { valid: true };
  },

  validateResponse: (field: DateFieldConfig, value: DateValue) => {
    const mode: DateMode = (field[FPs.MODE] as DateMode) || "date";

    const patterns: Record<DateMode, RegExp> = {
      date: /^\d{2}-\d{2}-\d{4}$/,
      month: /^\d{2}$/,
      "month-year": /^\d{2}-\d{4}$/,
      year: /^\d{4}$/,
    };

    const pattern = patterns[mode];
    if (!pattern.test(value)) {
      return { valid: false, error: "Invalid format for mode " + mode };
    }

    const checkValue = (): boolean => {
      if (mode === "date") {
        const [dd, mm, yyyy] = value.split("-").map(Number);
        return (
          dd >= 1 &&
          mm >= 1 &&
          mm <= 12 &&
          dd <= new Date(yyyy, mm, 0).getDate()
        );
      } else if (mode === "month-year") {
        const [mm, yyyy] = value.split("-").map(Number);
        return mm >= 1 && mm <= 12 && yyyy >= 1000 && yyyy <= 9999;
      } else if (mode === "month") {
        const mm = Number(value);
        return mm >= 1 && mm <= 12;
      } else if (mode === "year") {
        const yyyy = Number(value);
        return yyyy >= 1000 && yyyy <= 9999;
      }
      return false;
    };

    if (!checkValue()) return { valid: false, error: "Invalid date value" };

    const toComparableDate = (str: string): Date | null => {
      if (mode === "date") {
        const [dd, mm, yyyy] = str.split("-").map(Number);
        return new Date(yyyy, mm - 1, dd);
      } else if (mode === "month-year") {
        const [mm, yyyy] = str.split("-").map(Number);
        return new Date(yyyy, mm - 1, 1);
      } else if (mode === "year") {
        const yyyy = Number(str);
        return new Date(yyyy, 0, 1);
      }
      return null;
    };

    const restrictedModes: DateMode[] = ["date", "month-year", "year"];
    if (restrictedModes.includes(mode)) {
      const valDate = toComparableDate(value);
      if (!valDate) return { valid: false, error: "Invalid date" };

      const startStr = field[FPs.RESTRICTION_START_DATE];
      if (startStr) {
        const [d, m, y] = startStr.split("-").map(Number);
        const startDate = new Date(y, m - 1, d);
        if (valDate.getTime() < startDate.getTime()) {
          return { valid: false, error: "Before allowed range" };
        }
      }

      const endStr = field[FPs.RESTRICTION_END_DATE];
      if (endStr) {
        const [d, m, y] = endStr.split("-").map(Number);
        const endDate = new Date(y, m - 1, d);
        if (valDate.getTime() > endDate.getTime()) {
          return { valid: false, error: "After allowed range" };
        }
      }
    }

    return { valid: true };
  },
});
