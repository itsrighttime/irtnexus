import type {
  FormField,
  MultiDropdownFieldConfig,
  MultiDropdownValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.MULTI_DROPDOWN as FormFieldType, {
  validateConfig: (field: FormField) => {
    const options = (field as MultiDropdownFieldConfig)[FPs.OPTIONS];

    if (!Array.isArray(options) || options.length === 0) {
      return { valid: false, error: "Multi-dropdown must have options" };
    }
    return { valid: true };
  },

  validateResponse: (field: FormField, value: MultiDropdownValue) => {
    const options = (field as MultiDropdownFieldConfig)[FPs.OPTIONS];

    if (!Array.isArray(value)) {
      return { valid: false, error: "Value must be an array" };
    }

    for (const v of value) {
      if (!options.includes(v)) {
        return { valid: false, error: `Invalid selection: ${v}` };
      }
    }

    return { valid: true };
  },
});
