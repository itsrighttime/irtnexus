"use client";

import { ImageUpload } from "@/atoms";
import { useState } from "react";

export const TestImageUpload = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string>("");

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Test ImageUpload Component</h2>

      <ImageUpload
        label="Upload Profile Picture"
        setResult={setImageFile}
        setIsFieldValid={setIsValid}
        allowedTypes={["image/jpeg", "image/png"]}
        maxSizeMB={5}
        requireSquare={true}
        previewBorderRadius="50%"
        width="250px"
        height="250px"
        color="#52C9BD"
        backendError={backendError}
        value={imageFile}
        required={true}
      />

      <div style={{ marginTop: "1rem" }}>
        <h3>State Output:</h3>
        <p>
          <strong>Selected Image:</strong> {imageFile ? imageFile.name : "None"}
        </p>
        <p>
          <strong>Field Valid:</strong> {isValid ? "Valid" : "Invalid"}
        </p>
        {backendError && (
          <p style={{ color: "red" }}>
            <strong>Backend Error:</strong> {backendError}
          </p>
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setImageFile(null)}>Reset Image</button>
        <button onClick={() => setBackendError("Server rejected this image.")}>
          Simulate Backend Error
        </button>
        <button onClick={() => setBackendError("")}>Clear Backend Error</button>
      </div>
    </div>
  );
};
