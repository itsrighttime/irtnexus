import type { FormConfig } from "../types/formConfig.types.js";
import { FORM_FIELDS_TYPE } from "../validation/helper/fields";
import { configData07 } from "./data-07.js";

// Edge case 1: Missing compulsory `label` in text
export const configData_invalid_01: FormConfig = {
  ...configData07,
  fields: [
    { name: "textField", type: FORM_FIELDS_TYPE.TEXT }, // ❌ missing label
  ],
};

// Edge case 2: Duplicate field names
export const configData_invalid_02 = {
  ...configData07,
  fields: [
    { name: "dupField", type: FORM_FIELDS_TYPE.TEXT, label: "Text A" },
    { name: "dupField", type: FORM_FIELDS_TYPE.TEXT, label: "Text B" }, // ❌ duplicate name
  ],
};

// Edge case 3: Checkbox options invalid (missing `value`)
export const configData_invalid_03 = {
  ...configData07,
  fields: [
    {
      name: "badCheckbox",
      type: FORM_FIELDS_TYPE.CHECKBOX,
      label: "Bad Checkbox",
      options: [
        { label: "No Value" }, // ❌ missing value
        { value: "ok", label: "Valid One" },
      ],
    },
  ],
};

// Edge case 4: Radio options invalid (extra property not allowed)
export const configData_invalid_04 = {
  ...configData07,
  fields: [
    {
      name: "badRadio",
      type: FORM_FIELDS_TYPE.RADIO,
      label: "Bad Radio",
      options: [
        { value: "one", label: "One" },
        { value: "two", label: "Two", custom: "notAllowed" }, // ❌ invalid property
      ],
    },
  ],
};

// Edge case 5: Repeatable without `moreLabel`
export const configData_invalid_05 = {
  ...configData07,
  fields: [
    {
      name: "repeatBad",
      label: "Bad Repeatable",
      repeatable: true,
      fields: [{ name: "inner", type: FORM_FIELDS_TYPE.TEXT, label: "Inner" }],
      // ❌ missing moreLabel
    },
  ],
};

// Edge case 6: Conditional missing dependsOn/operator/value
export const configData_invalid_06 = {
  ...configData07,
  fields: [
    {
      name: "condBad",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Conditional Field",
      conditional: {
        dependsOn: "nonExistent", // ❌ invalid ref
        operator: "invalidOp", // ❌ invalid operator
        // missing value
      },
    },
  ],
};

// Edge case 7: Wrong type
export const configData_invalid_07 = {
  ...configData07,
  fields: [
    { name: "wrongType", type: "NotAFieldType", label: "Bad Type" }, // ❌ not in FORM_FIELDS_TYPE
  ],
};
