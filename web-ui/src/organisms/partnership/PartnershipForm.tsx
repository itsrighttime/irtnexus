import {
  FORM_FIELDS_TYPE,
  GenericForm,
  type FormConfig,
  FIELDS_PROPS as FP,
} from "@/templates";
import styles from "./PartnershipForm.module.css";

export const PartnershipForm = () => {
  const handleSubmit = (data: Record<string, any>) => {
    console.log("Form Submitted:", data);
    // alert("Form Submitted! Check console.");
  };

  const config: FormConfig = {
    [FP.TITLE]: "Complete User Form",
    [FP.DESCRIPTION]: "A single-step form including all field types",
    [FP.MODE]: "single",
    [FP.SETTINGS]: {
      [FP.SHOW_LABEL_ALWAYS]: true,
      [FP.COLOR]: "var(--color-primary)",
      [FP.GAP]: "2rem",
      [FP.WIDTH]: "100%",
      [FP.BOX_SHADOW]: "none",
      border: "none",
    },
    [FP.FIELDS]: [
      {
        [FP.NAME]: "partnerEntityType",
        [FP.LABEL]: "Partner Entity Type",
        [FP.TYPE]: FORM_FIELDS_TYPE.CHECKBOX,
        [FP.REQUIRED]: true,
        [FP.OPTIONS]: [
          {
            [FP.LABEL]: "Individual",
            [FP.VALUE]: "Individual",
          },
          {
            [FP.LABEL]: "Company",
            [FP.VALUE]: "Company",
          },
        ],
      },
      {
        [FP.NAME]: "partnerName",
        [FP.TYPE]: FORM_FIELDS_TYPE.TEXT,
        [FP.LABEL]: "Legal name or business name",
        [FP.REQUIRED]: true,
      },
      {
        [FP.NAME]: "fullName",
        [FP.TYPE]: FORM_FIELDS_TYPE.TEXT,
        [FP.LABEL]: "Contact Person Name",
        [FP.REQUIRED]: true,
      },
      {
        [FP.NAME]: "mobile",
        [FP.TYPE]: FORM_FIELDS_TYPE.MOBILE,
        [FP.LABEL]: "Phone Number",
        [FP.REQUIRED]: true,
      },
      {
        [FP.NAME]: "email",
        [FP.TYPE]: FORM_FIELDS_TYPE.EMAIL,
        [FP.LABEL]: "Email Address",
        [FP.REQUIRED]: true,
      },
      {
        [FP.NAME]: "industry",
        [FP.TYPE]: FORM_FIELDS_TYPE.MULTI_DROPDOWN,
        [FP.LABEL]: "Industry",
        [FP.REQUIRED]: true,
        [FP.OPTIONS]: [
          "Technology",
          "Healthcare",
          "Consulting",
          "Finance",
          "Others",
        ],
      },
      {
        [FP.NAME]: "otherIndustry",
        [FP.TYPE]: FORM_FIELDS_TYPE.TEXT,
        [FP.LABEL]: "Other Industry",
        [FP.REQUIRED]: true,

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
            [FP.NAME]: "linkNameDropdown",
            [FP.TYPE]: FORM_FIELDS_TYPE.DROPDOWN,
            [FP.LABEL]: "Industry",
            [FP.REQUIRED]: true,
            [FP.OPTIONS]: [
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
        [FP.NAME]: "expactedContribution",
        [FP.TYPE]: FORM_FIELDS_TYPE.MULTI_DROPDOWN,
        [FP.LABEL]: "How do you plan to contribute? ",
        [FP.REQUIRED]: true,
        [FP.OPTIONS]: [
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

  return (
    <div className={styles.partnershipFormWrapper}>
      <div className={styles.partnershipForm}>
        <GenericForm
          config={config}
          onSubmit={handleSubmit}
          submitLabel="Register"
        />
      </div>
    </div>
  );
};
