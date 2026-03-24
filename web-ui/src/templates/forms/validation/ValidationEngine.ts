import type { FormField } from "../types/register.types.js";
import { FIELDS_PROPS } from "./helper/fields.js";

export interface ValidatorResult {
  valid: boolean;
  error?: string;
}

interface FieldValidator {
  validateConfig: (field: FormField) => ValidatorResult;
  validateResponse: (field: FormField, value: any) => ValidatorResult;
}

type ValidatorRegistry = Record<string, FieldValidator>;

class ValidationEngine {
  private registry: ValidatorRegistry = {};

  /**
   * Register validators for a field type
   */
  register(fieldType: string, validator: FieldValidator) {
    this.registry[fieldType] = validator;
  }

  /**
   * Validate a field's config
   */
  validateConfig(field: FormField): ValidatorResult {
    const type = field[FIELDS_PROPS.TYPE];
    const validator = this.registry[type];
    if (!validator) {
      throw new Error(`No validator registered for field type: ${type}`);
    }
    return validator.validateConfig(field);
  }

  /**
   * Validate a field's response value
   */
  validateResponse(field: FormField, value: any): ValidatorResult {
    const type = field[FIELDS_PROPS.TYPE];
    const validator = this.registry[type];
    if (!validator) {
      throw new Error(`No validator registered for field type: ${type}`);
    }
    return validator.validateResponse(field, value);
  }

  /**
   * Get the full registry
   */
  getRegistry(): ValidatorRegistry {
    return this.registry;
  }

  /**
   * Get a validator for a specific type
   */
  get(type: string): FieldValidator | undefined {
    return this.registry[type];
  }
}

export const validationEngine = new ValidationEngine();
