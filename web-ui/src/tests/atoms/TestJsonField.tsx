"use client";

import { JsonField } from "@/atoms";
import { useState } from "react";

export const TestJsonField: React.FC = () => {
  const [result, setResult] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [backendError, setBackendError] = useState<string>("");

  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        maxWidth: "700px",
      }}
    >
      <h2>JsonField Manual Test</h2>

      {/* Basic JSON Field */}
      <div>
        <h3>Basic</h3>
        <JsonField
          label="Basic JSON"
          setResult={setResult}
          setIsFieldValid={setIsValid}
        />
        <p>
          <strong>Result:</strong>
        </p>
        <pre>{result || "No data yet"}</pre>
      </div>

      {/* Validation Test */}
      <div>
        <h3>Validation Test</h3>
        <JsonField
          label="Validation JSON"
          setResult={setResult}
          setIsFieldValid={setIsValid}
          showCharacterCount
          showWordCount
        />
        <p>Status: {isValid ? "Valid ✅" : "Invalid ❌"}</p>
      </div>

      {/* Pre-filled Value */}
      <div>
        <h3>Pre-filled JSON</h3>
        <JsonField
          label="Pre-filled"
          value={`{"name": "John", "age": 25}`}
          setResult={setResult}
          setIsFieldValid={setIsValid}
        />
      </div>

      {/* Hide On Save */}
      <div>
        <h3>Hide On Save</h3>
        <JsonField
          label="Auto Hide"
          setResult={setResult}
          setIsFieldValid={setIsValid}
          hideOnSave
        />
      </div>

      {/* Backend Error Simulation */}
      <div>
        <h3>Backend Error</h3>
        <JsonField
          label="Backend Error JSON"
          setResult={setResult}
          setIsFieldValid={setIsValid}
          backendError={backendError}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={() =>
              setBackendError("Server says JSON structure is invalid!")
            }
          >
            Trigger Backend Error
          </button>

          <button onClick={() => setBackendError("")}>Clear Error</button>
        </div>
      </div>

      {/* Styled + Required */}
      <div>
        <h3>Styled + Required</h3>
        <JsonField
          label="Styled JSON"
          setResult={setResult}
          setIsFieldValid={setIsValid}
          color="#6c5ce7"
          width="500px"
          isBorder
          required
        />
      </div>
    </div>
  );
};
