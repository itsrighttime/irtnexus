import type { URLFieldConfig, URLFieldValue } from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.URL, {
  validateConfig: (field: URLFieldConfig) => {
    // Currently, no extra validation for URL config
    return { valid: true };
  },

  validateResponse: (field: URLFieldConfig, value: URLFieldValue) => {
    if (typeof value !== "string") {
      return { valid: false, error: "Must be a string" };
    }

    const trimmed = value.trim();

    const normalizeUrl = (url: string) => {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return `https://${url}`;
      }
      return url;
    };

    const isValidUrl = (url: string) => {
      try {
        new URL(normalizeUrl(url));
        return true;
      } catch {
        return false;
      }
    };

    // URL format validation
    try {
      const url = normalizeUrl(trimmed);
      if (isValidUrl(url)) {
        return { valid: false, error: "Invalid URL protocol" };
      }
    } catch {
      return { valid: false, error: "Invalid URL format" };
    }

    return { valid: true };
  },
});
