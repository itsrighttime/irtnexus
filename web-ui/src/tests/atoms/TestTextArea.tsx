"use client";

import { TextArea } from "@/atoms";
import { useState } from "react";

export const TestTextArea: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [backendError, setBackendError] = useState<string>("");

  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        maxWidth: "600px",
      }}
    >
      <h2>TextArea Manual Test</h2>

      {/* Basic TextArea */}
      <div>
        <h3>Basic</h3>
        <TextArea label="Basic Input" value={value} setResult={setValue} />
        <p>Value: {value || "Empty"}</p>
      </div>

      {/* With Validation */}
      <div>
        <h3>Validation (min/max length)</h3>
        <TextArea
          label="Validation Input"
          value={value}
          setResult={setValue}
          minLength={5}
          maxLength={20}
          setIsFieldValid={setIsValid}
          showCharacterCount
        />
        <p>Status: {isValid ? "Valid ✅" : "Invalid ❌"}</p>
      </div>

      {/* Character + Word Count */}
      <div>
        <h3>Character & Word Count</h3>
        <TextArea
          label="Counts"
          value={value}
          setResult={setValue}
          showCharacterCount
          showWordCount
        />
      </div>

      {/* Disabled */}
      <div>
        <h3>Disabled</h3>
        <TextArea
          label="Disabled Input"
          value="You cannot edit this"
          setResult={() => {}}
          disabled
        />
      </div>

      {/* Backend Error Simulation */}
      <div>
        <h3>Backend Error</h3>
        <TextArea
          label="Backend Error Input"
          value={value}
          setResult={setValue}
          backendError={backendError}
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={() => setBackendError("Server says this is invalid!")}
          >
            Trigger Error
          </button>
          <button onClick={() => setBackendError("")}>Clear Error</button>
        </div>
      </div>

      {/* Required + Styled */}
      <div>
        <h3>Required + Styled</h3>
        <TextArea
          label="Styled Input"
          value={value}
          setResult={setValue}
          required
          color="#6c5ce7"
          width="400px"
          showLabelAlways
        />
      </div>
    </div>
  );
};
