import type {
  FormField,
  SimpleDropdownFieldConfig,
  DropdownSimpleValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.SIMPLE_DROPDOWN, {
  validateConfig: (field: FormField) => {
    const options = (field as SimpleDropdownFieldConfig).items;

    if (!Array.isArray(options) || options.length === 0) {
      return { valid: false, error: "Multi-dropdown must have options" };
    }
    return { valid: true };
  },

  validateResponse: (field: FormField, value: DropdownSimpleValue) => {
    const options = (field as SimpleDropdownFieldConfig).items;

    if (!Array.isArray(value)) {
      return { valid: false, error: "Value must be an array" };
    }

    if (!Array.isArray(options) || options.length === 0) {
      return { valid: false, error: "Dropdown must have options" };
    }

    for (const v of value) {
      if (!options.includes(v)) {
        return { valid: false, error: `Invalid selection: ${v}` };
      }
    }

    return { valid: true };
  },
});
