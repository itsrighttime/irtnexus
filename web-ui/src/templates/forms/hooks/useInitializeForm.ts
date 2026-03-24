import { useMemo } from "react";
import { VALIDITY } from "../helper/validity";
import { FIELDS_PROPS as FPs } from "../validation/helper/fields";
import type { FormField } from "../types/register.types";

export interface FormState {
  [key: string]: any; // Each key is a field name, value can be string, object, array
}

export interface FormError {
  [key: string]: any; // Same shape as state, but stores VALIDITY or nested objects/arrays
}

export function useInitializeForm(allFields: FormField[] = []) {
  const { initialState, initialError } = useMemo(() => {
    const buildFieldState = (fieldDef: FormField): any => {
      const fieldName = fieldDef[FPs.NAME];
      const isRepeatable = !!fieldDef[FPs.REPEATABLE];
      const subFields = fieldDef[FPs.FIELDS];
      const isGroup = Array.isArray(subFields) && subFields.length > 0;

      if (isRepeatable) {
        const repeatedEntry = isGroup
          ? subFields.reduce((acc: Record<string, any>, subField) => {
              acc[subField[FPs.NAME]] = buildFieldState(subField);
              return acc;
            }, {})
          : "value" in fieldDef
            ? fieldDef.value
            : "";

        return [repeatedEntry];
      }

      if (isGroup) {
        return subFields.reduce((acc: Record<string, any>, subField) => {
          acc[subField[FPs.NAME]] = buildFieldState(subField);
          return acc;
        }, {});
      }

      return "value" in fieldDef ? fieldDef.value : "";
    };

    const buildFieldError = (fieldDef: FormField): any => {
      const isRepeatable = !!fieldDef[FPs.REPEATABLE];
      const subFields = fieldDef[FPs.FIELDS];
      const isGroup = Array.isArray(subFields) && subFields.length > 0;

      if (isRepeatable) {
        const repeatedErrorEntry = isGroup
          ? subFields.reduce((acc: Record<string, any>, subField) => {
              acc[subField[FPs.NAME]] = buildFieldError(subField);
              return acc;
            }, {})
          : fieldDef[FPs.REQUIRED]
            ? VALIDITY.invalid
            : VALIDITY.valid;

        return [repeatedErrorEntry];
      }

      if (isGroup) {
        return subFields.reduce((acc: Record<string, any>, subField) => {
          acc[subField[FPs.NAME]] = buildFieldError(subField);
          return acc;
        }, {});
      }

      return fieldDef[FPs.REQUIRED] ? VALIDITY.invalid : VALIDITY.valid;
    };

    const state: FormState = {};
    const errors: FormError = {};

    allFields.forEach((f) => {
      state[f[FPs.NAME]] = buildFieldState(f);
      errors[f[FPs.NAME]] = buildFieldError(f);
    });

    return { initialState: state, initialError: errors };
  }, [allFields]);

  return { initialState, initialError };
}
