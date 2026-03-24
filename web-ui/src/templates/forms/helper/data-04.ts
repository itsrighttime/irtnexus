import type { FormConfig } from "../types/formConfig.types";
import { FORM_FIELDS_TYPE } from "../validation/helper/fields";
import { OPERATORS } from "../validation/helper/operators";

export const configData04: FormConfig = {
  title: "Cross Field Conditional Example",
  description: "Testing conditionals on non-dropdown fields",
  mode: "single",
  settings: {
    showLabelAlways: true,
    color: "var(--colorOrange)",
    gap: "2rem",
  },
  fields: [
    // TEXT field controlling another field
    {
      name: "country",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Country",
      placeholder: "Enter your country",
    },
    {
      name: "state",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "State / Province",
      placeholder: "Shown only if country is India",
      conditional: {
        dependsOn: "country",
        operator: OPERATORS.equals,
        value: ["India"],
      },
    },

    // EMAIL controlling another field
    {
      name: "email",
      type: FORM_FIELDS_TYPE.EMAIL,
      label: "Email Address",
      placeholder: "Enter your email",
    },
    {
      name: "companyDomain",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Company Domain",
      placeholder: "Visible if email ends with @company.com",
      conditional: {
        dependsOn: "email",
        operator: OPERATORS.contains,
        value: ["@company.com"],
      },
    },

    // FILE controlling another field
    {
      name: "resume",
      type: FORM_FIELDS_TYPE.FILE,
      label: "Upload Resume",
      multiple: false,
      maxFiles: 1,
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedTypes: ["application/pdf"],
    },
    {
      name: "resumeNote",
      type: FORM_FIELDS_TYPE.TEXT_AREA,
      label: "Resume Note",
      placeholder: "This appears only if resume is uploaded",
      conditional: {
        dependsOn: "resume",
        operator: OPERATORS.notEquals,
        value: [""], // not empty means file uploaded
      },
    },
  ],
};
