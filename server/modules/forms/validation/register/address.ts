import type {
  AddressFieldConfig,
  AddressValue,
} from "../../types/register.types";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";
import {
  validationEngine as engine,
  type ValidatorResult,
} from "../ValidationEngine";

engine.register(FORM_FIELDS_TYPE.ADDRESS, {
  validateConfig: (field: AddressFieldConfig): ValidatorResult => {
    const flags = [
      FPs.IS_HOUSE,
      FPs.IS_STREET,
      FPs.IS_CITY,
      FPs.IS_STATE,
      FPs.IS_POSTAL,
      FPs.IS_COUNTRY,
      FPs.IS_LANDMARK,
      FPs.IS_ADDRESS_LINE,
    ];

    for (const f of flags) {
      if (field[f] !== undefined && typeof field[f] !== "boolean") {
        return { valid: false, error: `${f} must be boolean` };
      }
    }

    return { valid: true };
  },

  validateResponse: (
    field: AddressFieldConfig,
    value: AddressValue,
  ): ValidatorResult => {
    if (typeof value !== "object" || value === null) {
      return { valid: false, error: "Address must be an object" };
    }

    const subFieldConfigs = [
      {
        key: "house" as keyof AddressValue,
        visible: field[FPs.IS_HOUSE],
        regex: /^[A-Za-z0-9\s,\/.\-]*$/,
        min: 1,
        max: 10,
        msg: "House must be letters, numbers, space, hyphen, dot, or slash",
      },
      {
        key: "street" as keyof AddressValue,
        visible: field[FPs.IS_STREET],
        regex: /^[A-Za-z0-9\s,]*$/,
        min: 1,
        max: 100,
        msg: "Street must be letters, numbers, spaces, or commas",
      },
      {
        key: "city" as keyof AddressValue,
        visible: field[FPs.IS_CITY],
        regex: /^[A-Za-z0-9\s]*$/,
        min: 2,
        max: 50,
        msg: "City must be letters, numbers, and spaces",
      },
      {
        key: "state" as keyof AddressValue,
        visible: field[FPs.IS_STATE],
        regex: /^[A-Za-z\s]*$/,
        min: 2,
        max: 50,
        msg: "State must be letters and spaces",
      },
      {
        key: "postal" as keyof AddressValue,
        visible: field[FPs.IS_POSTAL],
        regex: /^[0-9]*$/,
        min: 4,
        max: 8,
        msg: "Postal code must be 4-8 digits",
      },
      {
        key: "country" as keyof AddressValue,
        visible: field[FPs.IS_COUNTRY],
        regex: /^[A-Za-z\s]*$/,
        min: 2,
        max: 50,
        msg: "Country must be letters and spaces",
      },
      {
        key: "landmark" as keyof AddressValue,
        visible: field[FPs.IS_LANDMARK],
        regex: /^[A-Za-z0-9\s,]*$/,
        min: 2,
        max: 50,
        msg: "Landmark must be letters, numbers, spaces, or commas",
      },
      {
        key: "addressLine" as keyof AddressValue,
        visible: field[FPs.IS_ADDRESS_LINE],
        regex: /^[A-Za-z0-9\s,]*$/,
        min: 2,
        max: 50,
        msg: "Address Line must be letters, numbers, spaces, or commas",
      },
    ];

    for (const sub of subFieldConfigs) {
      if (!sub.visible) continue;

      const val = value[sub.key];
      if (val == null || val === "") {
        return { valid: false, error: `${sub.key} is required` };
      }
      if (typeof val !== "string") {
        return { valid: false, error: `${sub.key} must be string` };
      }
      if (val.length < sub.min || val.length > sub.max) {
        return {
          valid: false,
          error: `${sub.key} length must be ${sub.min}-${sub.max}`,
        };
      }
      if (!sub.regex.test(val)) {
        return { valid: false, error: sub.msg };
      }
    }

    return { valid: true };
  },
});
