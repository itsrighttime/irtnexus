import type {
  FormField,
  SearchFieldConfig,
  SearchValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.SEARCH, {
  validateConfig: (field: FormField) => {
    const options = (field as SearchFieldConfig)["suggestions"];

    if (!Array.isArray(options)) {
      return { valid: false, error: "Search options must be an array" };
    }
    return { valid: true };
  },

  validateResponse: (field: FormField, value: SearchValue) => {
    const options = (field as SearchFieldConfig)["suggestions"];

    if (typeof value !== "string") {
      return { valid: false, error: "Search value must be a string" };
    }

    // Optional: check if value exists in options
    // if (!field[FPs.OPTIONS].includes(value)) {
    //   return { valid: false, error: "Invalid search selection" };
    // }

    return { valid: true };
  },
});
