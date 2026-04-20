import { FORM_FIELDS_TYPE, type FormConfig } from "@/templates";

export const config03: FormConfig = {
  title: "Complete User Form",
  description: "A single-step form including all field types",
  mode: "single",
  settings: {
    showLabelAlways: true,
    color: "var(--colorCyan)",
    gap: "2rem",
  },
  fields: [
    {
      name: "fullName",
      type: FORM_FIELDS_TYPE.TEXT,
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
    //   min: 3,
    //   max: 50,
    },
    {
      name: "email",
      type: FORM_FIELDS_TYPE.EMAIL,
      label: "Email Address",
      placeholder: "Enter your email",
      required: false,
    },
    {
      name: "password",
      type: FORM_FIELDS_TYPE.PASSWORD,
      label: "Password",
      placeholder: "Enter a secure password",
      required: true,
    //   min: 8,
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
      required: true,
    },
    {
      name: "appointmentTime",
      type: FORM_FIELDS_TYPE.TIME,
      label: "Preferred Appointment Time",
    },
    {
      name: "address",
      type: FORM_FIELDS_TYPE.ADDRESS,
      label: "Residential Address",
      isHouse: true,
      isStreet: true,
      isCity: true,
      isState: true,
      isPostal: true,
      isCountry: true,
      isLandmark: true,
    },
    {
      name: "gender",
      type: FORM_FIELDS_TYPE.DROPDOWN,
      label: "Gender",
      options: ["Male", "Female", "Other"],
    },
    {
      name: "hobbies",
      type: FORM_FIELDS_TYPE.MULTI_DROPDOWN,
      label: "Hobbies",
      options: ["Reading", "Traveling", "Gaming", "Music"],
    },
    {
      name: "bio",
      type: FORM_FIELDS_TYPE.TEXT_AREA,
      label: "Short Bio",
      placeholder: "Tell us about yourself",
      minLength: 10,
      maxLength: 500,
      showCharacterCount: true,
    },
    {
      name: "education",
      label: "Education Details (Repeatable)",
      repeatable: true,
      type: FORM_FIELDS_TYPE.GROUP,
      moreLabel: "Add Other Degree",
      fields: [
        {
          name: "degree",
          type: FORM_FIELDS_TYPE.TEXT,
          label: "Degree",
          placeholder: "Enter degree",
        },
        {
          name: "year",
          type: FORM_FIELDS_TYPE.DATE,
          label: "Year of Passing",
        },
      ],
    },
    {
      name: "resume",
      type: FORM_FIELDS_TYPE.FILE,
      label: "Upload Resume / Documents",
    //   multiple: true,
    //   maxFiles: 5,
      maxSizeMb: 2 * 1024 * 1024, // 2MB
      allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    },
    {
      name: "audio",
      type: FORM_FIELDS_TYPE.AUDIO,
      label: "Upload Audio",
    //   maxFiles: 5,
      maxSizeMb: 2 * 1024 * 1024, // 2MB
    },
    {
      name: "video",
      type: FORM_FIELDS_TYPE.VIDEO,
      label: "Upload Vidoe",
    //   maxSize: 2 * 1024 * 1024, // 2MB
    //   preview: true,
    },
    {
      name: "image",
      type: FORM_FIELDS_TYPE.IMAGE,
      label: "Upload Image",
    //   maxFiles: 5,
      requireSquare: false,
    },
  ],
};
