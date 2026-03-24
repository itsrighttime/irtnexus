import { useMemo } from "react";
import { VALIDITY } from "../helper/validity.js";
import { FIELDS_PROPS as FPs } from "../validation/helper/fields.js";

export function useInitializeForm(allFields = []) {
  const { initialState, initialError } = useMemo(() => {
    /**
     * Recursively builds the state for a given field definition.
     * Handles repeatable groups, nested fields, and default values.
     */
    const buildFieldState = (fieldDef) => {
      const fieldName = fieldDef[FPs.NAME];
      const isRepeatable = !!fieldDef[FPs.REPEATABLE];
      const subFields = fieldDef[FPs.FIELDS];
      const isGroup = Array.isArray(subFields) && subFields.length > 0;

      // Case 1: Repeatable group (array of object structures)
      if (isRepeatable) {
        // Initialize with at least one empty entry
        const repeatedEntry = isGroup
          ? subFields.reduce((acc, subField) => {
              acc[subField[FPs.NAME]] = buildFieldState(subField);
              return acc;
            }, {})
          : fieldDef[FPs.VALUE] ?? "";

        return [repeatedEntry];
      }

      // Case 2: Nested group (non-repeatable)
      if (isGroup) {
        return subFields.reduce((acc, subField) => {
          acc[subField[FPs.NAME]] = buildFieldState(subField);
          return acc;
        }, {});
      }

      // Case 3: Simple field
      return fieldDef[FPs.VALUE] ?? "";
    };

    /**
     * Recursively builds the error object aligned with the state structure.
     */
    const buildFieldError = (fieldDef) => {
      const isRepeatable = !!fieldDef[FPs.REPEATABLE];
      const subFields = fieldDef[FPs.FIELDS];
      const isGroup = Array.isArray(subFields) && subFields.length > 0;

      // Case 1: Repeatable group
      if (isRepeatable) {
        const repeatedErrorEntry = isGroup
          ? subFields.reduce((acc, subField) => {
              acc[subField[FPs.NAME]] = buildFieldError(subField);
              return acc;
            }, {})
          : fieldDef[FPs.REQUIRED]
          ? VALIDITY.invalid
          : VALIDITY.valid;

        return [repeatedErrorEntry];
      }

      // Case 2: Nested group
      if (isGroup) {
        return subFields.reduce((acc, subField) => {
          acc[subField[FPs.NAME]] = buildFieldError(subField);
          return acc;
        }, {});
      }

      // Case 3: Simple field
      return fieldDef[FPs.REQUIRED] ? VALIDITY.invalid : VALIDITY.valid;
    };

    /**
     * Build top-level state & error for the entire form schema.
     */
    const state = {};
    const errors = {};

    allFields.forEach((f) => {
      state[f[FPs.NAME]] = buildFieldState(f);
      errors[f[FPs.NAME]] = buildFieldError(f);
    });

    return { initialState: state, initialError: errors };
  }, [allFields]);

  return { initialState, initialError };
}
