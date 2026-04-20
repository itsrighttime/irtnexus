import type { FormField } from "../types/register.types.js";
import { FIELDS_PROPS, type FormFieldType } from "./helper/fields.js";

export interface ValidatorResult {
  valid: boolean;
  error?: string;
}

type RegisteredFieldType = FormField["type"];

interface FieldValidator<TField extends FormField = FormField, TValue = any> {
  validateConfig: (field: TField) => ValidatorResult;
  validateResponse: (field: TField, value: TValue) => ValidatorResult;
}

type ValidatorRegistry = Partial<{
  [K in RegisteredFieldType]: FieldValidator<
    Extract<FormField, { type: K }>,
    any
  >;
}>;

class ValidationEngine {
  private registry: ValidatorRegistry = {};

  /**
   * Register validators for a field type
   */
  register<K extends RegisteredFieldType>(
    fieldType: K,
    validator: FieldValidator<Extract<FormField, { type: K }>>,
  ) {
    this.registry[fieldType] = validator as ValidatorRegistry[K];
  }

  /**
   * Validate a field's config
   */
  validateConfig(field: FormField): ValidatorResult {
    const validator = this.registry[field.type];

    if (!validator) {
      throw new Error(`No validator for ${field.type}`);
    }

    return validator.validateConfig(field as any);
  }

  /**
   * Validate a field's response value
   */
  validateResponse(field: FormField, value: unknown): ValidatorResult {
    const validator = this.registry[field.type];

    if (!validator) {
      throw new Error(`No validator for ${field.type}`);
    }

    return validator.validateResponse(field as any, value);
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
  get(type: RegisteredFieldType) {
    return this.registry[type];
  }
}

export const validationEngine = new ValidationEngine();
