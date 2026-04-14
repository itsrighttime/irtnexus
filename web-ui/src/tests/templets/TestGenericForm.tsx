"use client";

import { GenericForm } from "@/templates";
import { config01 } from "./config-form/config-01";
import { config02 } from "./config-form/config-02";
import { config03 } from "./config-form/config-03";



export function TestGenericForm() {
  const config = config03;

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
