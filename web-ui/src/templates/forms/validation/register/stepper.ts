import type {
  FormField,
  StepperFieldConfig,
  StepperValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.STEPPER, {
  validateConfig: (field: FormField) => {
    const field_ = field as StepperFieldConfig;
    const { [FPs.MIN]: MIN, [FPs.MAX]: MAX } = field_;

    if (typeof MIN !== "number" || typeof MAX !== "number") {
      return { valid: false, error: "Stepper must have numeric min/max" };
    }
    if (MIN >= MAX) {
      return { valid: false, error: "Stepper min must be less than max" };
    }

    return { valid: true };
  },

  validateResponse: (field: FormField, value: StepperValue) => {
    const field_ = field as StepperFieldConfig;
    const { [FPs.MIN]: MIN, [FPs.MAX]: MAX, [FPs.STEP]: STEP } = field_;

    if (typeof value !== "number") {
      return { valid: false, error: "Stepper value must be a number" };
    }
    if (typeof MIN !== "number" || typeof MAX !== "number") {
      return { valid: false, error: "Invalid slider config" };
    }

    if (value < MIN || value > MAX) {
      return { valid: false, error: "Stepper value out of range" };
    }
    if (STEP !== undefined && (value - MIN) % STEP !== 0) {
      return { valid: false, error: "Stepper value not aligned with step" };
    }

    return { valid: true };
  },
});
