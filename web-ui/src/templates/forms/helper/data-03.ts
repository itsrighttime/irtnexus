import type { FormConfig } from "../types/formConfig.types";
import { FORM_FIELDS_TYPE } from "../validation/helper/fields";
import { OPERATORS } from "../validation/helper/operators";

export const configData03: FormConfig = {
  title: "Advanced Conditional Operators Example",
  description: "Form testing all conditional operators",
  mode: "single",
  settings: {
    showLabelAlways: true,
    color: "var(--colorGreen)",
    gap: "2rem",
  },
  fields: [
    // Base dropdown to control conditionals
    {
      name: "userType",
      type: FORM_FIELDS_TYPE.DROPDOWN,
      label: "User Type",
      required: true,
      options: ["Guest", "Basic", "Premium", "VIP"],
    },

    // IN operator
    {
      name: "discountCode",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Discount Code",
      placeholder: "Enter discount code",
      conditional: {
        dependsOn: "userType",
        operator: OPERATORS.in,
        value: ["Premium", "VIP"], // show if Premium or VIP
      },
    },

    // NOT IN operator
    {
      name: "restrictedNote",
      type: FORM_FIELDS_TYPE.TEXT_AREA,
      label: "Restricted Notes",
      placeholder: "Visible if NOT guest",
      conditional: {
        dependsOn: "userType",
        operator: OPERATORS.notIn,
        value: ["Guest"],
      },
    },

    // EQUALS operator
    {
      name: "basicEmail",
      type: FORM_FIELDS_TYPE.EMAIL,
      label: "Basic User Email",
      placeholder: "Email Only for basic users",
      conditional: {
        dependsOn: "userType",
        operator: OPERATORS.equals,
        value: ["Basic"],
      },
    },

    // NOT EQUALS operator
    {
      name: "vipCode",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "VIP Secret Code",
      placeholder: "Hidden if userType is VIP",
      conditional: {
        dependsOn: "userType",
        operator: OPERATORS.notEquals,
        value: ["VIP"],
      },
    },

    // Score input for numeric checks
    {
      name: "score",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Game Score",
      placeholder: "Enter your score",
    },

    // GREATER THAN OR EQUAL (gte)
    {
      name: "highScoreBonus",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "High Score Bonus",
      placeholder: "Visible if score >= 80",
      conditional: {
        dependsOn: "score",
        operator: OPERATORS.gte,
        value: [80],
      },
    },

    // LESS THAN (lt)
    {
      name: "lowScoreAdvice",
      type: FORM_FIELDS_TYPE.TEXT_AREA,
      label: "Advice for Low Scores",
      placeholder: "Visible if score < 50",
      conditional: {
        dependsOn: "score",
        operator: OPERATORS.lt,
        value: [50],
      },
    },

    // Multi-dropdown for contains tests
    {
      name: "hobbies",
      type: FORM_FIELDS_TYPE.MULTI_DROPDOWN,
      label: "Hobbies",
      options: ["Reading", "Traveling", "Gaming", "Other"],
    },

    // CONTAINS operator
    {
      name: "otherHobby",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Other Hobby",
      placeholder: "Specify your other hobby",
      conditional: {
        dependsOn: "hobbies",
        operator: OPERATORS.contains,
        value: ["Other"],
      },
    },

    // NOT CONTAINS operator
    {
      name: "noTravelNote",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Note (if not traveling)",
      placeholder: "Visible if Traveling is not selected",
      conditional: {
        dependsOn: "hobbies",
        operator: OPERATORS.notContains,
        value: ["Traveling"],
      },
    },
  ],
};
