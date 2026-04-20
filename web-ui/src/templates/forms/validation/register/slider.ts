import type {
  FormField,
  SliderFieldConfig,
  SliderValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.SLIDER, {
  validateConfig: (field: FormField) => {
    const field_ = field as SliderFieldConfig;
    const { [FPs.MIN]: MIN, [FPs.MAX]: MAX } = field_;

    if (typeof MIN !== "number" || typeof MAX !== "number") {
      return { valid: false, error: "Slider must have numeric min/max" };
    }
    if (MIN >= MAX) {
      return { valid: false, error: "Slider min must be less than max" };
    }

    return { valid: true };
  },

  validateResponse: (field: FormField, value: SliderValue) => {
    const field_ = field as SliderFieldConfig;
    const { [FPs.MIN]: MIN, [FPs.MAX]: MAX, [FPs.STEP]: STEP } = field_;

    if (typeof MIN !== "number" || typeof MAX !== "number") {
      return { valid: false, error: "Invalid slider config" };
    }

    if (typeof value !== "number") {
      return { valid: false, error: "Slider value must be a number" };
    }

    if (value < MIN || value > MAX) {
      return { valid: false, error: "Slider value out of range" };
    }

    if (STEP !== undefined && (value - MIN) % STEP !== 0) {
      return { valid: false, error: "Slider value not aligned with step" };
    }

    return { valid: true };
  },
});
