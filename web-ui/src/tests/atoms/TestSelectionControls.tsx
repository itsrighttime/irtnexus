import React, { useState } from "react";
import { CheckboxGroup } from "@/atoms";
import { RadioGroup } from "@/atoms";

export const TestSelectionControls: React.FC = () => {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<any>([]);
  const [selectedRadio, setSelectedRadio] = useState<string | number | null>(
    null,
  );

  return (
    <div style={{ padding: "40px", fontFamily: "var(--font-family)" }}>
      <h2>Selection Controls Test</h2>

      {/* Checkbox Group */}
      <div style={{ marginBottom: "40px" }}>
        <CheckboxGroup
          label="Select Hobbies"
          required
          options={[
            { value: "reading", label: "Reading" },
            { value: "traveling", label: "Traveling" },
            { value: "gaming", label: "Gaming", disabled: true },
            { value: "music", label: "Music", help: "Includes instruments" },
          ]}
          value={["reading"]}
          setResult={setSelectedCheckboxes}
          layout="horizontal"
          color="#1E90FF"
          width="400px"
        />
        <p>
          Selected Hobbies:{" "}
          {selectedCheckboxes.length > 0
            ? selectedCheckboxes.join(", ")
            : "None"}
        </p>
      </div>

      {/* Radio Group */}
      <div style={{ marginBottom: "40px" }}>
        <RadioGroup
          label="Select Gender"
          required
          options={[
            { key: 1, value: "male", label: "Male" },
            { key: 2, value: "female", label: "Female" },
            { key: 3, value: "other", label: "Other" },
          ]}
          value="female"
          setResult={setSelectedRadio}
          layout="vertical"
          color="#FF69B4"
          width="300px"
        />
        <p>Selected Gender: {selectedRadio || "None"}</p>
      </div>

      {/* Disabled Example */}
      <div style={{ marginBottom: "40px" }}>
        <CheckboxGroup
          label="Disabled Options"
          options={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
          ]}
          setResult={() => {}}
          disabled
          color="#999"
        />
      </div>

      {/* Mixed Layout */}
      <div style={{ marginBottom: "40px" }}>
        <RadioGroup
          label="Choose Plan"
          options={[
            { key: "basic", value: "basic", label: "Basic" },
            { key: "pro", value: "pro", label: "Pro" },
            { key: "enterprise", value: "enterprise", label: "Enterprise" },
          ]}
          setResult={setSelectedRadio}
          layout="horizontal"
          color="#00b894"
        />
      </div>
    </div>
  );
};
