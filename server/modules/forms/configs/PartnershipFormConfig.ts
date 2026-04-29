import { FormConfig } from "../types";
import { FORM_FIELDS_TYPE } from "../validation";

export const PartnershipFormConfig: FormConfig = {
  title: "Complete User Form",
  description: "A single-step form including all field types",
  mode: "single",
  settings: {
    showLabelAlways: true,
    color: "var(--color-primary)",
    gap: "2rem",
    width: "100%",
    boxShadow: "none",
    border: "none",
  },
  fields: [
    {
      name: "partnerEntityType",
      label: "Partner Entity Type",
      type: FORM_FIELDS_TYPE.CHECKBOX,
      required: true,
      options: [
        {
          label: "Individual",
          value: "Individual",
        },
        {
          label: "Company",
          value: "Company",
        },
      ],
    },
    {
      name: "partnerName",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Legal name or business name",
      required: true,
    },
    {
      name: "fullName",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Contact Person Name",
      required: true,
    },
    {
      name: "mobile",
      type: FORM_FIELDS_TYPE.MOBILE,
      label: "Phone Number",
      required: true,
    },
    {
      name: "email",
      type: FORM_FIELDS_TYPE.EMAIL,
      label: "Email Address",
      required: true,
    },
    {
      name: "industry",
      type: FORM_FIELDS_TYPE.MULTI_DROPDOWN,
      label: "Industry",
      required: true,
      options: ["Technology", "Healthcare", "Consulting", "Finance", "Others"],
    },
    {
      name: "otherIndustry",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Other Industry",
      required: true,

      conditional: {
        dependsOn: "industry",
        value: ["Others"],
        operator: "equals",
      },
    },

    {
      name: "partnershipType",
      type: FORM_FIELDS_TYPE.CHECKBOX,
      label: "Type of Partnership",
      required: true,
      options: [
        {
          help: "People who have strong business relationships but do not want to sell.",
          value: "Referral Partner",
          label: "Referral Partner",
        },
        {
          help: "Partners who want to be more involved in opportunity development.",
          value: "Strategic Partner",
          label: "Strategic Partner",
        },
        {
          help: "Partners who enhance delivery capacity or specialization.",
          value: "Delivery Partner",
          label: "Delivery Partner",
        },
        {
          help: "Organizations or individuals with deep industry access or strategic leverage.",
          value: "Business Development Partner",
          label: "Business Development Partner",
        },
      ],
    },
    {
      name: "businessOverview",
      type: FORM_FIELDS_TYPE.TEXT_AREA,
      label: "Company / Individual Overview",
      required: true,
    },
    {
      name: "onlinePresence",
      type: FORM_FIELDS_TYPE.GROUP,
      label: "Online Presence",
      required: true,
      repeatable: true,
      moreLabel: "Add More Links",
      fields: [
        {
          name: "linkNameDropdown",
          type: FORM_FIELDS_TYPE.DROPDOWN,
          label: "Industry",
          required: true,
          options: [
            "Website",
            "Social Media",
            "Portfolio",
            "Blog / Article",
            "Store / Ecommerce",
            "Video",
            "Document",
            "Contact Page",
            "Others",
          ],
        },
        {
          name: "otherLinkName",
          type: FORM_FIELDS_TYPE.TEXT,
          label: "Name",
          required: true,
          conditional: {
            dependsOn: "linkNameDropdown",
            value: ["Others"],
            operator: "equals",
          },
        },
        {
          name: "link",
          type: FORM_FIELDS_TYPE.URL,
          label: "Link",
          required: true,
          conditional: {
            dependsOn: "linkNameDropdown",
            value: [
              "Website",
              "Social Media",
              "Portfolio",
              "Blog / Article",
              "Store / Ecommerce",
              "Video",
              "Document",
              "Contact Page",
              "Others",
            ],
            operator: "in",
          },
        },
      ],
    },
    {
      name: "expactedContribution",
      type: FORM_FIELDS_TYPE.MULTI_DROPDOWN,
      label: "How do you plan to contribute? ",
      required: true,
      options: [
        "Opportunity Identification",
        "Introductions & Referrals",
        "Relationship Facilitation",
        "Network Access",
        "Industry Insight / Advisory",
        "Conversation Support (Non-Sales)",
        "Strategic Collaboration",
        "Others",
      ],
    },

    {
      name: "otherexpactedContributionName",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Name",
      required: true,
      conditional: {
        dependsOn: "expactedContribution",
        value: ["Others"],
        operator: "equals",
      },
    },
    {
      name: "expactedContributionDesc",
      type: FORM_FIELDS_TYPE.TEXT_AREA,
      label: "Contribution Description",
      required: true,
      conditional: {
        dependsOn: "expactedContribution",
        value: [
          "Opportunity Identification",
          "Introductions & Referrals",
          "Relationship Facilitation",
          "Network Access",
          "Industry Insight / Advisory",
          "Conversation Support (Non-Sales)",
          "Strategic Collaboration",
          "Others",
        ],
        operator: "in",
      },
    },
    {
      name: "documents",
      type: FORM_FIELDS_TYPE.FILE,
      label: "Upload Supporting Documents",
      maxFiles: 5,
      maxSizeMb: 20,
    },
  ],
};
