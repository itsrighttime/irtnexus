"use client";

import { FORM_FIELDS_TYPE, GenericForm, type FormConfig } from "@/templates";

export function TestGenericForm() {
  const config: FormConfig = {
    mode: "multi",
    title: "User Registration",
    description: "Fill all the details for you registration",
    step: [
      {
        title: "Basic Info",
        description: "Fill User Info",
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
        ],
      },
      {
        title: "More Info",
        fields: [
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
      },
    ],
  };

  const handleSubmit = (data: Record<string, any>) => {
    console.log("Form Submitted:", data);
    alert("Form Submitted! Check console.");
  };

  return (
    <div style={{ padding: "20px" }}>
      <GenericForm
        config={config}
        onSubmit={handleSubmit}
        submitLabel="Register"
      />
    </div>
  );
}
