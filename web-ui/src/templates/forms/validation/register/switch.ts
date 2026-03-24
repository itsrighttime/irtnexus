import type {
  SwitchFieldConfig,
  SwitchValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.SWITCH as FormFieldType, {
  validateConfig: (_field: SwitchFieldConfig) => {
    return { valid: true };
  },

  validateResponse: (_field: SwitchFieldConfig, value: SwitchValue) => {
    if (typeof value !== "boolean") {
      return { valid: false, error: "Switch must be true/false" };
    }
    return { valid: true };
  },
});
