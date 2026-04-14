import type { ImageFieldConfig, ImageValue } from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.FILE as FormFieldType, {
  validateConfig: (field: ImageFieldConfig) => {
    // Destructure for clarity
    const MAX_SIZE_MB = field[FPs.MAX_SIZE_MB];
    const ALLOWED_TYPES = field[FPs.ALLOWED_TYPES];

    if (
      MAX_SIZE_MB !== undefined &&
      (typeof MAX_SIZE_MB !== "number" || MAX_SIZE_MB <= 0)
    ) {
      return { valid: false, error: "maxSizeMB must be a positive number" };
    }

    if (ALLOWED_TYPES !== undefined && !Array.isArray(ALLOWED_TYPES)) {
      return { valid: false, error: "allowedTypes must be an array" };
    }

    return { valid: true };
  },

  validateResponse: (field: ImageFieldConfig, value: ImageValue) => {
    if (typeof value !== "object" || !value) {
      return { valid: false, error: "Value must be an image file" };
    }

    // Destructure config
    const MAX_SIZE_MB = field[FPs.MAX_SIZE_MB];
    const ALLOWED_TYPES = field[FPs.ALLOWED_TYPES];
    const REQUIRE_SQUARE = field[FPs.REQUIRE_SQUARE];

    if (MAX_SIZE_MB !== undefined && value.size > MAX_SIZE_MB * 1024 * 1024) {
      return {
        valid: false,
        error: `Image size must not exceed ${MAX_SIZE_MB} MB`,
      };
    }

    if (ALLOWED_TYPES !== undefined && !ALLOWED_TYPES.includes(value.type)) {
      return { valid: false, error: `Image type ${value.type} not allowed` };
    }

    if (REQUIRE_SQUARE && value.width !== value.height) {
      return { valid: false, error: "Image must be square" };
    }

    return { valid: true };
  },
});
