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
    ],
  };

  return (
    <div className={styles.partnershipForm}>
      <GenericForm
        config={config}
        onSubmit={handleSubmit}
        submitLabel="Register"
      />
    </div>
  );
};
