import type { VideoFieldConfig, VideoFile } from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.VIDEO, {
  validateConfig: (field: VideoFieldConfig) => {
    const {
      [FPs.MAX_SIZE_MB]: MAX_SIZE_MB,
      [FPs.ALLOWED_TYPES]: ALLOWED_TYPES,
    } = field;

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

  validateResponse: (field: VideoFieldConfig, value: VideoFile) => {
    const {
      [FPs.MAX_SIZE_MB]: MAX_SIZE_MB,
      [FPs.ALLOWED_TYPES]: ALLOWED_TYPES,
    } = field;

    if (typeof value !== "object" || value === null) {
      return { valid: false, error: "Value must be a video file" };
    }

    if (MAX_SIZE_MB !== undefined && value.size > MAX_SIZE_MB * 1024 * 1024) {
      return {
        valid: false,
        error: `Video size must not exceed ${MAX_SIZE_MB} MB`,
      };
    }

    if (ALLOWED_TYPES !== undefined && !ALLOWED_TYPES.includes(value.type)) {
      return { valid: false, error: `Video type ${value.type} not allowed` };
    }

    return { valid: true };
  },
});
