import { FORM_FIELDS_TYPE, type FormConfig } from "@/templates";

export const config04: FormConfig = {
  title: "Complete User Form",
  description: "A single-step form including all field types",
  mode: "single",
  settings: {
    showLabelAlways: true,
    color: "var(--colorRed)",
    gap: "2rem",
    width: "50%",
  },
  fields: [
    {
      name: "fullName",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    {
      name: "email",
      type: FORM_FIELDS_TYPE.EMAIL,
      label: "Email Address",
      placeholder: "Enter your email",
    },
    {
      name: "password",
      type: FORM_FIELDS_TYPE.PASSWORD,
      label: "Password",
      required: true,
    },
    {
      name: "mobile",
      type: FORM_FIELDS_TYPE.MOBILE,
      label: "Mobile Number",
      required: true,
    },
    {
      name: "birthDate",
      type: FORM_FIELDS_TYPE.DATE,
      label: "Date of Birth",
    },
    {
      name: "dayPicker",
      type: FORM_FIELDS_TYPE.DAY,
      label: "Select Day",
    },
    {
      name: "monthPicker",
      type: FORM_FIELDS_TYPE.MONTH,
      label: "Select Month",
    },
    {
      name: "monthYearPicker",
      type: FORM_FIELDS_TYPE.MONTH_YEAR,
      label: "Select Month & Year",
    },
    {
      name: "yearPicker",
      type: FORM_FIELDS_TYPE.YEAR,
      label: "Select Year",
    },
    {
      name: "appointmentTime",
      type: FORM_FIELDS_TYPE.TIME,
      label: "Preferred Time",
    },
    {
      name: "address",
      type: FORM_FIELDS_TYPE.ADDRESS,
      label: "Address",
      isCity: true,
      isState: true,
      isCountry: true,
    },
    {
      name: "gender",
      type: FORM_FIELDS_TYPE.DROPDOWN,
      label: "Gender",
      options: ["Male", "Female", "Other"],
    },
    // {
    //   name: "simpleDropdown",
    //   type: FORM_FIELDS_TYPE.SIMPLE_DROPDOWN,
    //   label: "Simple Dropdown",
    //   items: ["A", "B", "C"],
    // },
    {
      name: "hobbies",
      type: FORM_FIELDS_TYPE.MULTI_DROPDOWN,
      label: "Hobbies",
      options: ["Reading", "Gaming", "Music"],
    },
    {
      name: "radioChoice",
      type: FORM_FIELDS_TYPE.RADIO,
      label: "Choose One",
      options: ["Option 1", "Option 2"],
    },
    {
      name: "checkboxGroup",
      type: FORM_FIELDS_TYPE.CHECKBOX,
      label: "Select Options",
      options: ["A", "B", "C"],
    },
    {
      name: "search",
      type: FORM_FIELDS_TYPE.SEARCH,
      label: "Search",
      suggestions: [
        { code: "Apple", name: "Apple" },
        { code: "Banana", name: "Banana" },
        { code: "Orange", name: "Orange" },
      ],
    },
    {
      name: "bio",
      type: FORM_FIELDS_TYPE.TEXT_AREA,
      label: "Short Bio",
      minLength: 10,
      maxLength: 200,
      showCharacterCount: true,
    },
    {
      name: "jsonInput",
      type: FORM_FIELDS_TYPE.JSON,
      label: "JSON Input",
      showCharacterCount: true,
    },
    // {
    //   name: "color",
    //   type: FORM_FIELDS_TYPE.COLOR,
    //   label: "Pick Color",
    // },
    {
      name: "switch",
      type: FORM_FIELDS_TYPE.SWITCH,
      label: "Enable Feature",
    },
    {
      name: "slider",
      type: FORM_FIELDS_TYPE.SLIDER,
      label: "Select Range",
      min: 0,
      max: 100,
      step: 5,
    },
    {
      name: "stepper",
      type: FORM_FIELDS_TYPE.STEPPER,
      label: "Stepper Input",
      min: 1,
      max: 10,
    },
    {
      name: "otp",
      type: FORM_FIELDS_TYPE.OTP,
      label: "Enter OTP",
      length: 6,
      verificationEndpoint: "/verify-otp",
      userId: "user-123",
    },
    // {
    //   name: "securityQuestion",
    //   type: FORM_FIELDS_TYPE.SECURITY_QUESTION,
    //   label: "Security Question",
    //   options: ["Your pet name?", "Your school name?"],
    // },
    {
      name: "url",
      type: FORM_FIELDS_TYPE.URL,
      label: "Website URL",
      placeholder: "https://example.com",
    },
    {
      name: "fileUpload",
      type: FORM_FIELDS_TYPE.FILE,
      label: "Upload File",
      maxSizeMb: 20,
      maxFiles: 10,
      allowedTypes: ["application/pdf"],
    },
    {
      name: "audio",
      type: FORM_FIELDS_TYPE.AUDIO,
      label: "Upload Audio",
      maxSizeMb: 200,
    },
    {
      name: "video",
      type: FORM_FIELDS_TYPE.VIDEO,
      label: "Upload Video",
      preview: true,
    },
    {
      name: "image",
      type: FORM_FIELDS_TYPE.IMAGE,
      label: "Upload Image",
      requireSquare: false,
    },

    /* -------------------- GROUP TEST -------------------- */

    {
      name: "education",
      label: "Education (Repeatable)",
      type: FORM_FIELDS_TYPE.GROUP,
      repeatable: true,
      moreLabel: "Add Degree",
      fields: [
        {
          name: "degree",
          type: FORM_FIELDS_TYPE.TEXT,
          label: "Degree",
        },
        {
          name: "year",
          type: FORM_FIELDS_TYPE.YEAR,
          label: "Year",
        },
      ],
    },

    /* -------------------- CONDITIONAL TEST -------------------- */

    {
      name: "conditionalField",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Only shows if switch is ON",
      conditional: {
        dependsOn: "switch",
        value: [true],
        operator: "equals",
      },
    },
  ],
};
