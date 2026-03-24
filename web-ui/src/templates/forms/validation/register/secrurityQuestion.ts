import type {
  FormField,
  SecurityQuestionFieldConfig,
  SecurityQuestionValue,
} from "../../types/register.types";
import { validationEngine as engine } from "../ValidationEngine";
import { FIELDS_PROPS as FPs } from "../helper/fields";
import { FORM_FIELDS_TYPE, type FormFieldType } from "../helper/fields";

engine.register(FORM_FIELDS_TYPE.SECURITY_QUESTION as FormFieldType, {
  validateConfig: (field: FormField) => {
    const options = (field as SecurityQuestionFieldConfig)[FPs.OPTIONS];

    if (!Array.isArray(options) || options.length === 0) {
      return { valid: false, error: "Security Question must have options" };
    }
    return { valid: true };
  },

  validateResponse: (field: FormField, value: SecurityQuestionValue) => {
    const options = (field as SecurityQuestionFieldConfig)[FPs.OPTIONS];
    if (typeof value !== "object" || value === null) {
      return {
        valid: false,
        error: "Value must be an object with question and answer",
      };
    }

    const { question, answer } = value;

    // Validate question
    if (!question || typeof question !== "string") {
      return { valid: false, error: "Question must be a string" };
    }
    if (!options.includes(question)) {
      return { valid: false, error: "Invalid security question selected" };
    }

    // Validate answer
    if (!answer || typeof answer !== "string" || answer.trim().length === 0) {
      return { valid: false, error: "Answer must be a non-empty string" };
    }

    return { valid: true };
  },
});
