import type { AudioFieldConfig, AudioValue } from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.AUDIO as FormFieldType, {
  validateConfig: (field: AudioFieldConfig) => {
    const { [FPs.MAX_SIZE_MB]: maxSize, [FPs.ALLOWED_TYPES]: allowedTypes } =
      field;

    if (
      maxSize !== undefined &&
      (typeof maxSize !== "number" || maxSize <= 0)
    ) {
      return {
        valid: false,
        error: `${FPs.MAX_SIZE_MB} must be a positive number`,
      };
    }

    if (allowedTypes !== undefined && !Array.isArray(allowedTypes)) {
      return { valid: false, error: `${FPs.ALLOWED_TYPES} must be an array` };
    }

    return { valid: true };
  },

  validateResponse: (field: AudioFieldConfig, value: AudioValue) => {
    const { [FPs.MAX_SIZE_MB]: maxSize, [FPs.ALLOWED_TYPES]: allowedTypes } =
      field;

    if (typeof value !== "object" || value === null) {
      return { valid: false, error: "Value must be an audio file" };
    }

    if (maxSize !== undefined && value.size > maxSize * 1024 * 1024) {
      return {
        valid: false,
        error: `Audio size must not exceed ${maxSize} MB`,
      };
    }

    if (allowedTypes !== undefined && !allowedTypes.includes(value.type)) {
      return { valid: false, error: `Audio type ${value.type} not allowed` };
    }

    return { valid: true };
  },
});
