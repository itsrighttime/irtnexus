import { FORM_FIELDS_TYPE, type FormConfig } from "@/templates";

export const config02: FormConfig = {
  mode: "single",
  title: "User Registration",
  description: "Fill all the details for you registration",
  fields: [
    {
      name: "firstName",
      label: "First Name",
      type: FORM_FIELDS_TYPE.TEXT,
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: FORM_FIELDS_TYPE.PASSWORD,
      required: true,
    },

    {
      name: "lastName",
      label: "Last Name",
      type: FORM_FIELDS_TYPE.TEXT,
      required: true,
    },
    {
      name: "hobbies",
      label: "Hobbies",
      type: FORM_FIELDS_TYPE.TEXT,
      repeatable: true,
      moreLabel: "Add Hobby",
      fields: [
        {
          name: "hobby",
          label: "Hobby",
          type: FORM_FIELDS_TYPE.TEXT,
        },
      ],
    },
  ],
};
