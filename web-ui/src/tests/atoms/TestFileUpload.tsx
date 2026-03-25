// TestFileUpload.tsx
"use client";

import { FileUpload } from "@/atoms";
import { useState } from "react";

export const TestFileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Test FileUpload Component</h2>

      <FileUpload
        value={files}
        label="Upload your files"
        setResult={(newFiles) => {
          console.log("Updated files:", newFiles);
          setFiles(newFiles);
        }}
        setIsFieldValid={setIsValid}
        allowedTypes={["image/png", "image/jpeg", "application/pdf"]}
        maxSize={5} // 5 MB
        multiple
        maxFiles={3}
        required
        color="#0070f3"
        width="600px"
        height="250px"
      />

      <div style={{ marginTop: "20px" }}>
        <strong>Current files:</strong>
        <ul>
          {files.map((file, idx) => (
            <li key={idx}>
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </li>
          ))}
        </ul>
        <p>
          Field valid: <strong>{isValid ? "Yes" : "No"}</strong>
        </p>
      </div>
    </div>
  );
};
