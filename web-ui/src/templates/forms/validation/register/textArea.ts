import type {
  TextAreaFieldConfig,
  TextAreaValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.TEXT_AREA as FormFieldType, {
  validateConfig: (field: TextAreaFieldConfig) => {
    const { [FPs.MIN_LENGTH]: MIN_LENGTH, [FPs.MAX_LENGTH]: MAX_LENGTH } =
      field;

    if (MIN_LENGTH !== undefined && typeof MIN_LENGTH !== "number") {
      return { valid: false, error: "minLength must be a number" };
    }
    if (MAX_LENGTH !== undefined && typeof MAX_LENGTH !== "number") {
      return { valid: false, error: "maxLength must be a number" };
    }

    return { valid: true };
  },

  validateResponse: (field: TextAreaFieldConfig, value: TextAreaValue) => {
    const { [FPs.MIN_LENGTH]: MIN_LENGTH, [FPs.MAX_LENGTH]: MAX_LENGTH } =
      field;

    if (typeof value !== "string") {
      return { valid: false, error: "TextArea must be a string" };
    }
    if (MIN_LENGTH !== undefined && value.length < MIN_LENGTH) {
      return { valid: false, error: `Minimum length is ${MIN_LENGTH}` };
    }
    if (MAX_LENGTH !== undefined && value.length > MAX_LENGTH) {
      return { valid: false, error: `Maximum length is ${MAX_LENGTH}` };
    }

    return { valid: true };
  },
});
