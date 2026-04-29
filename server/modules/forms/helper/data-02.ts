import type { FormConfig } from "../types/formConfig.types";
import { FORM_FIELDS_TYPE } from "../validation/helper/fields";
import { OPERATORS } from "../validation/helper/operators";

// import { OPERATORS } from "../jsx/operators";

export const configData02: FormConfig = {
  title: "Conditional Fields Example",
  description: "Form with conditional field rendering",
  mode: "single",
  settings: {
    showLabelAlways: true,
    color: "var(--colorBlue)",
    gap: "2rem",
  },
  fields: [
    {
      name: "employmentStatus",
      type: FORM_FIELDS_TYPE.DROPDOWN,
      label: "Employment Status",
      required: true,
      options: ["Student", "Employed", "Self-Employed", "Unemployed"],
    },
    {
      name: "companyName",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Company Name",
      placeholder: "Enter your company",
      conditional: {
        dependsOn: "employmentStatus",
        operator: OPERATORS.in,
        value: ["Employed", "Self-Employed"], // only visible if employed or self-employed
      },
    },
    {
      name: "studentId",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Student ID",
      placeholder: "Enter student ID",
      conditional: {
        dependsOn: "employmentStatus",
        operator: OPERATORS.in,
        value: ["Student"], // only visible if student
      },
    },
    {
      name: "portfolio",
      type: FORM_FIELDS_TYPE.FILE,
      label: "Upload Portfolio",
      multiple: false,
      maxFiles: 1,
      maxSizeMb: 5 * 1024 * 1024, // 5MB
      allowedTypes: ["application/pdf"],
      required: true,
      conditional: {
        dependsOn: "employmentStatus",
        operator: OPERATORS.in,
        value: ["Self-Employed"], // only visible if self-employed
      },
    },
    {
      name: "newsletterOptIn",
      type: FORM_FIELDS_TYPE.DROPDOWN,
      label: "Subscribe to Newsletter?",
      required: true,
      options: ["Yes", "No"],
    },
    {
      name: "email",
      type: FORM_FIELDS_TYPE.EMAIL,
      label: "Email Address",
      placeholder: "Enter your email",
      conditional: {
        dependsOn: "newsletterOptIn",
        operator: OPERATORS.in,
        value: ["Yes"], // only show email if user opts in
      },
    },
    {
      name: "resume",
      type: FORM_FIELDS_TYPE.FILE,
      label: "Upload Resume / Documents",
      multiple: true,
      maxFiles: 1,
      maxSizeMb: 2 * 1024 * 1024, // 2MB
      allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    },
  ],
};
