import type {
  FormField,
  RadioFieldConfig,
  RadioValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.RADIO, {
  validateConfig: (field: FormField) => {
    const options = (field as RadioFieldConfig)[FPs.OPTIONS];

    if (!Array.isArray(options) || options.length === 0) {
      return { valid: false, error: "Radio must have options" };
    }

    for (const opt of options) {
      if (typeof opt === "string") continue;

      if (!opt.label || typeof opt.label !== "string") {
        return { valid: false, error: "Each option must have a label" };
      }
      if (!opt.value || typeof opt.value !== "string") {
        return { valid: false, error: "Each option must have a value" };
      }
    }

    return { valid: true };
  },

  validateResponse: (field: FormField, value: RadioValue) => {
    const options = (field as RadioFieldConfig)[FPs.OPTIONS];

    if (typeof value !== "string") {
      return { valid: false, error: "Radio value must be a string" };
    }

    const validValues = options.map((opt) =>
      typeof opt === "string" ? opt : opt.value,
    );

    if (!validValues.includes(value)) {
      return { valid: false, error: `Invalid radio selection: ${value}` };
    }

    return { valid: true };
  },
});
