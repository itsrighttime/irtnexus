import type { FormConfig } from "../types/formConfig.types";
import { FORM_FIELDS_TYPE } from "../validation/helper/fields";
import { OPERATORS } from "../validation/helper/operators";

export const configData05: FormConfig = {
  title: "Multi-Step Conditional Example",
  description:
    "Testing conditions across steps. Testing conditions acros. Testing across steps. conditions across steps. Testing conditions across . ",
  mode: "multi",
  settings: {
    showLabelAlways: true,
    color: "var(--colorGreen)",
    gap: "2rem",
  },
  steps: [
    {
      title: "Step 1: Basic Info",
      fields: [
        {
          name: "employmentStatus",
          type: FORM_FIELDS_TYPE.DROPDOWN,
          label: "Employment Status",
          required: true,
          options: ["Student", "Employed", "Self-Employed", "Unemployed"],
        },
        {
          name: "country",
          type: FORM_FIELDS_TYPE.TEXT,
          label: "Country",
          placeholder: "Enter your country",
        },
      ],
    },
    {
      title: "Step 2: Conditional Fields",
      fields: [
        {
          name: "companyName",
          type: FORM_FIELDS_TYPE.TEXT,
          label: "Company Name",
          placeholder: "Enter your company",
          conditional: {
            dependsOn: "employmentStatus",
            operator: OPERATORS.in,
            value: ["Employed", "Self-Employed"],
          },
        },
        {
          name: "studentId",
          type: FORM_FIELDS_TYPE.TEXT,
          label: "Student ID",
          placeholder: "Enter student ID",
          conditional: {
            dependsOn: "employmentStatus",
            operator: OPERATORS.equals,
            value: ["Student"],
          },
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
      ],
    },
    {
      title: "Step 3: Communication",
      fields: [
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
            operator: OPERATORS.equals,
            value: ["Yes"],
          },
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
      ],
    },
    {
      title: "Step 4: Documents",
      fields: [
        {
          name: "resume",
          type: FORM_FIELDS_TYPE.FILE,
          label: "Upload Resume",
          multiple: false,
          maxFiles: 1,
          maxSizeMB: 2 * 1024 * 1024,
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
            value: ["", []],
          },
        },
      ],
    },
  ],
};
