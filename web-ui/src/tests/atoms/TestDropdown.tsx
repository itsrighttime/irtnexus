"use client";

import { Dropdown } from "@/atoms";
import { useState } from "react";

export const TestDropdown: React.FC = () => {
  const [singleResult, setSingleResult] = useState<string[]>([]);
  const [multiResult, setMultiResult] = useState<string[]>([]);
  const [dynamicOptions, setDynamicOptions] = useState<string[]>([
    "Apple",
    "Banana",
    "Cherry",
  ]);

  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        gap: "40px",
        flexWrap: "wrap",
      }}
    >
      {/* Single Select */}
      <div>
        <h3>Single Select</h3>
        <Dropdown
          options={["Option 1", "Option 2", "Option 3"]}
          label="Select One"
          setResult={setSingleResult}
          value={singleResult}
          color="#52c9bd"
        />
        <p>Selected: {singleResult.join(", ") || "None"}</p>
      </div>

      {/* Multi Select */}
      <div>
        <h3>Multi Select</h3>
        <Dropdown
          options={["Red", "Green", "Blue"]}
          multiple
          label="Select Colors"
          setResult={setMultiResult}
          value={multiResult}
          color="#ff7a59"
        />
        <p>Selected: {multiResult.join(", ") || "None"}</p>
      </div>

      {/* Add New Option */}
      <div>
        <h3>Add New Options</h3>
        <Dropdown
          options={dynamicOptions}
          multiple
          label="Fruits"
          setResult={(res) => console.log("Fruits:", res)}
          setAddedOptions={setDynamicOptions}
          addNew
          color="#6c5ce7"
        />
        <p>Available Options: {dynamicOptions.join(", ")}</p>
      </div>

      {/* Required + Placeholder */}
      <div>
        <h3>Required Field</h3>
        <Dropdown
          options={["A", "B", "C"]}
          label="Required Dropdown"
          setResult={(res) => console.log("Required:", res)}
          required
          placeholder="Please select..."
          color="#e17055"
        />
      </div>
    </div>
  );
};
