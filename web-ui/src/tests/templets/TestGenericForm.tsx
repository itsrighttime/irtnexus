"use client";

import { GenericForm } from "@/templates";
import { config01 } from "./config-form/config-01";
import { config02 } from "./config-form/config-02";

export function TestGenericForm() {
  const config = config02;

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
