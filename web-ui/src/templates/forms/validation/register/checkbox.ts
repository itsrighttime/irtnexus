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
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.CHECKBOX as FormFieldType, {
  validateConfig: (field: FormField): ValidatorResult => {
    if (field[FPs.TYPE] !== FORM_FIELDS_TYPE.CHECKBOX) {
      return { valid: true };
    }
    const options = (field as CheckboxFieldConfig)[FPs.OPTIONS];

    if (!Array.isArray(options) || options.length === 0) {
      return { valid: false, error: "Checkbox must have options" };
    }

    for (const opt of options) {
      const { label, value } = opt;
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

    const validValues = options.map((opt) => opt.value);

    for (const v of value) {
      if (!validValues.includes(v)) {
        return { valid: false, error: `Invalid checkbox selection: ${v}` };
      }
    }

    return { valid: true };
  },
});
