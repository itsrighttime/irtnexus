"use client";

import { VideoUpload } from "@/atoms";
import { useState } from "react";

export const TestVideoUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [backendError, setBackendError] = useState<string | undefined>();

  // Simulate backend error after 5 seconds (optional)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setBackendError("Server rejected this video.");
  //   }, 5000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Test VideoUpload Component</h2>

      <VideoUpload
        label="Upload your video"
        setResult={setVideoFile}
        setIsFieldValid={setIsValid}
        allowedTypes={["video/mp4", "video/webm"]}
        maxSizeMb={10} // limit to 10MB for testing
        preview={true}
        width="480px"
        height="270px"
        color="#52C9BD"
        backendError={backendError}
        value={videoFile}
        required={true}
      />

      <div style={{ marginTop: "1rem" }}>
        <h3>State Output:</h3>
        <p>
          <strong>Selected Video:</strong> {videoFile ? videoFile.name : "None"}
        </p>
        <p>
          <strong>Field Valid:</strong>{" "}
          {isValid === null ? "Not set" : isValid ? "Valid" : "Invalid"}
        </p>
        {backendError && (
          <p style={{ color: "red" }}>
            <strong>Backend Error:</strong> {backendError}
          </p>
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setVideoFile(null)}>Reset Video</button>
        <button onClick={() => setBackendError("Server rejected this video.")}>
          Simulate Backend Error
        </button>
        <button onClick={() => setBackendError(undefined)}>
          Clear Backend Error
        </button>
      </div>
    </div>
  );
};
