import type {
  FormField,
  OTPFieldConfig,
  OTPValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.OTP, {
  validateConfig: (field: FormField) => {
    const field_ = field as OTPFieldConfig;
    const { [FPs.LENGTH]: length } = field_;

    if (!length || length < 4 || length > 8) {
      return { valid: false, error: "OTP length must be 4-8" };
    }
    return { valid: true };
  },

  validateResponse: (field: FormField, value: OTPValue) => {
    const field_ = field as OTPFieldConfig;
    const { [FPs.LENGTH]: length, [FPs.IS_NUMERIC]: isNumeric } = field_;

    if (typeof value !== "string") {
      return { valid: false, error: "OTP must be string" };
    }

    if (value.length !== length) {
      return { valid: false, error: "OTP length mismatch" };
    }

    if (isNumeric && !/^\d+$/.test(value)) {
      return { valid: false, error: "OTP must be numeric" };
    }

    return { valid: true };
  },
});
