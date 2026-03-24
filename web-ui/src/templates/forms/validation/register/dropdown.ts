import type {
  DropdownFieldConfig,
  DropdownValue,
  FormField,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.DROPDOWN as FormFieldType, {
  validateConfig: (field: FormField) => {
    if (field[FPs.TYPE] !== FORM_FIELDS_TYPE.CHECKBOX) {
      return { valid: true };
    }
    const options = (field as DropdownFieldConfig)[FPs.OPTIONS];

    if (!Array.isArray(options) || options.length === 0) {
      return { valid: false, error: "Dropdown must have options" };
    }
    return { valid: true };
  },

  validateResponse: (field: FormField, value: DropdownValue) => {
    const options = (field as DropdownFieldConfig)[FPs.OPTIONS];
    const selected = Array.isArray(value) ? value[0] : value;

    if (!options.includes(selected)) {
      return { valid: false, error: "Invalid selection" };
    }

    return { valid: true };
  },
});
