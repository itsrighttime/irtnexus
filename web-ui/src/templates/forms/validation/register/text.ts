import type { TextFieldConfig, TextValue } from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.TEXT as FormFieldType, {
  validateConfig: (field: TextFieldConfig) => {
    const { [FPs.MIN_LENGTH]: MIN_LENGTH, [FPs.MAX_LENGTH]: MAX_LENGTH } =
      field;

    if (
      MIN_LENGTH !== undefined &&
      MAX_LENGTH !== undefined &&
      MIN_LENGTH > MAX_LENGTH
    ) {
      return { valid: false, error: "minLength cannot exceed maxLength" };
    }

    return { valid: true };
  },

  validateResponse: (field: TextFieldConfig, value: TextValue) => {
    const { [FPs.MIN_LENGTH]: MIN_LENGTH, [FPs.MAX_LENGTH]: MAX_LENGTH } =
      field;

    if (typeof value !== "string") {
      return { valid: false, error: "Must be string" };
    }
    if (MIN_LENGTH !== undefined && value.length < MIN_LENGTH) {
      return { valid: false, error: "Too short" };
    }
    if (MAX_LENGTH !== undefined && value.length > MAX_LENGTH) {
      return { valid: false, error: "Too long" };
    }

    return { valid: true };
  },
});
