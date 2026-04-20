import type {
  CheckboxFieldConfig,
  CheckboxValue,
  FormField,
} from "../../types/register.types";
import {
  validationEngine as engine,
  type ValidatorResult,
} from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.CHECKBOX, {
  validateConfig: (field: FormField): ValidatorResult => {
    if (field[FPs.TYPE] !== FORM_FIELDS_TYPE.CHECKBOX) {
      return { valid: true };
    }
    const options = (field as CheckboxFieldConfig)[FPs.OPTIONS];

    if (!Array.isArray(options) || options.length === 0) {
      return { valid: false, error: "Checkbox must have options" };
    }

    for (const opt of options) {
      if (typeof opt === "string") {
        // string option: value === label
        if (!opt || typeof opt !== "string") {
          return { valid: false, error: "Invalid option string" };
        }
        continue;
      }

      const label = opt?.label;
      const value = opt?.value;
      if (!label || typeof label !== "string") {
        return { valid: false, error: "Each option must have a label" };
      }
      if (!value || typeof value !== "string") {
        return { valid: false, error: "Each option must have a value" };
      }
    }

    return { valid: true };
  },

  validateResponse: (field: FormField, value: CheckboxValue) => {
    if (field[FPs.TYPE] !== FORM_FIELDS_TYPE.CHECKBOX) {
      return { valid: true };
    }
    const options = (field as CheckboxFieldConfig)[FPs.OPTIONS];

    if (!Array.isArray(value)) {
      return { valid: false, error: "Checkbox value must be an array" };
    }

    if (!Array.isArray(options)) {
      return { valid: false, error: "Invalid field configuration" };
    }

    const validValues = options.map((opt) =>
      typeof opt === "string" ? opt : opt.value,
    );

    for (const v of value) {
      if (!validValues.includes(v)) {
        return { valid: false, error: `Invalid checkbox selection: ${v}` };
      }
    }

    return { valid: true };
  },
});
