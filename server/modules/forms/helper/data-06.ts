import type { FormConfig } from "../types/formConfig.types";
import { FORM_FIELDS_TYPE } from "../validation/helper/fields";
import { OPERATORS } from "../validation/helper/operators";

export const configData06: FormConfig = {
  title: "Repeatable Fields Example",
  description: "Form to test repeatable groups",
  mode: "single",
  settings: {
    showLabelAlways: true,
    color: "var(--colorPurple)",
    gap: "2rem",
  },
  fields: [
    {
      name: "fullName",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Full Name",
      required: true,
      placeholder: "Enter your full name",
    },
    {
      name: "skills",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Skills",
      placeholder: "Enter a skill",
    },
    {
      name: "education",
      label: "Education",
      repeatable: true,
      type: FORM_FIELDS_TYPE.GROUP,
      moreLabel: "Add Other Degree",
      fields: [
        {
          name: "degree",
          type: FORM_FIELDS_TYPE.TEXT,
          label: "Degree",
          placeholder: "Enter your degree",
        },
        {
          name: "yearOfPassing",
          type: FORM_FIELDS_TYPE.DATE,
          label: "Year of Passing",
        },
        {
          name: "institution",
          type: FORM_FIELDS_TYPE.TEXT,
          label: "Institution Name",
          placeholder: "Enter institution name",
        },
      ],
    },
    {
      name: "workExperience",
      label: "Work Experience",
      repeatable: true,
      type: FORM_FIELDS_TYPE.GROUP,
      moreLabel: "Add Other Details",
      fields: [
        {
          name: "company",
          type: FORM_FIELDS_TYPE.TEXT,
          label: "Company Name",
          placeholder: "Enter company name",
        },
        {
          name: "role",
          type: FORM_FIELDS_TYPE.TEXT,
          label: "Role",
          placeholder: "Enter your role",
        },
        {
          name: "duration",
          type: FORM_FIELDS_TYPE.TEXT,
          label: "Duration",
          placeholder: "Enter duration (e.g., 2 years)",
        },
        {
          name: "currentlyWorking",
          type: FORM_FIELDS_TYPE.DROPDOWN,
          label: "Currently Working?",
          options: ["Yes", "No"],
        },
        {
          name: "noticePeriod",
          type: FORM_FIELDS_TYPE.TEXT,
          label: "Notice Period",
          placeholder: "Enter notice period",
          conditional: {
            dependsOn: "currentlyWorking",
            operator: OPERATORS.equals,
            value: ["Yes"], // only visible if currently working
          },
        },
      ],
    },
  ],
};
