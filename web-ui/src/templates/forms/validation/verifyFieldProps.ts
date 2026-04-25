import {
  CORE_FIELDS_PROPS,
  FIELDS_PROPS as FPs,
  GENERIC_PROP,
  type FormFieldType,
} from "./helper/fields.js";
import { FORM_FIELDS_TYPE } from "./helper/fields.js";
import { pushError } from "./helper/errorFormatter.js";
import type { FormField } from "../types/register.types.js";

interface ErrorsMap {
  [key: string]: any;
}

/**
 * Verifies a field's properties against allowed generic and type-specific props.
 * Checks for:
 *  - Invalid or missing properties
 *  - Checkbox/Radio options
 *  - Repeatable fields consistency
 *  - Conditional dependency integrity
 */
export const verifyFieldProps = (field: FormField, errors: ErrorsMap) => {
  const genericAllowed = [...GENERIC_PROP.compulsory, ...GENERIC_PROP.optional];

  const coreProps = CORE_FIELDS_PROPS[field[FPs.TYPE]] || {
    compulsory: [],
    optional: [],
  };

  const allowedProps = [
    ...genericAllowed,
    ...coreProps.compulsory,
    ...coreProps.optional,
  ];

  const fieldKeys = Object.keys(field);

  // --- Check for invalid properties --- // TODO : Update the fields.ts CORE_FIELDS_PROPS
  // for (const key of fieldKeys) {
  //   if (!allowedProps.includes(key)) {
  //     pushError(errors, field, `Invalid property: ${key}`);
  //   }
  // }

  // --- Generic compulsory properties ---
  for (const key of GENERIC_PROP.compulsory) {
    if (!fieldKeys.includes(key)) {
      if (field[FPs.REPEATABLE] && key === FPs.TYPE) continue; // TYPE can be skipped for repeatable
      pushError(errors, field, `Missing generic compulsory property: ${key}`);
    }
  }

  const isSelectableField = (
    field: FormField,
  ): field is FormField & { options: any[] } => {
    return (
      field[FPs.TYPE] === FORM_FIELDS_TYPE.CHECKBOX ||
      field[FPs.TYPE] === FORM_FIELDS_TYPE.RADIO
    );
  };

  if (isSelectableField(field)) {
    const options = field[FPs.OPTIONS];

    if (!Array.isArray(options) || options.length === 0) {
      pushError(
        errors,
        field,
        `Field ${field[FPs.NAME]} must have a non-empty options array`,
      );
    } else {
      for (const opt of options) {
        const optKeys = Object.keys(opt);

        if (typeof opt === "string") continue;

        // compulsory keys
        if (!opt.value) {
          pushError(
            errors,
            field,
            `Option in ${field[FPs.NAME]} missing compulsory property: ${FPs.VALUE}`,
          );
        }
        if (!opt.label) {
          pushError(
            errors,
            field,
            `Option in ${field[FPs.NAME]} missing compulsory property: ${FPs.LABEL}`,
          );
        }

        // check for invalid keys
        const allowedKeys = [
          FPs.VALUE,
          FPs.LABEL,
          "help",
          "value",
          "label",
          "disabled",
        ];
        for (const k of optKeys) {
          if (!allowedKeys.includes(k)) {
            pushError(
              errors,
              field,
              `Option in ${field[FPs.NAME]} has invalid property: ${k}`,
            );
          }
        }
      }
    }
  }

  // --- Repeatable fields check ---
  if (field[FPs.FIELDS]) {
    if (!field[FPs.REPEATABLE] || !field[FPs.MORE_LABEL]) {
      pushError(
        errors,
        field,
        `"fields" present but "repeatable" or "moreLabel" missing`,
      );
    }
  }

  // --- Conditional dependency check ---
  if (field[FPs.CONDITIONAL]) {
    const COND = field[FPs.CONDITIONAL];
    if (COND) {
      if (!COND[FPs.DEPENDS_ON] || !COND[FPs.OPERATOR] || !COND[FPs.VALUE]) {
        pushError(
          errors,
          field,
          `Conditional must include dependsOn, operator, and value`,
        );
      }
    }
  }
};
