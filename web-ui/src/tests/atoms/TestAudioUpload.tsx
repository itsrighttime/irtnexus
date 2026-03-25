"use client";

import { AudioUpload } from "@/atoms";
import { useState } from "react";

export const TestAudioUpload = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(false);

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      <h2>Test AudioUpload Component</h2>

      {/* Default Audio Upload */}
      <AudioUpload
        label="Upload an audio file"
        setResult={(file) => {
          setAudioFile(file);
          console.log("Selected file:", file);
        }}
        setIsFieldValid={setIsValid}
        color="#52C9BD"
        allowedTypes={["audio/mpeg", "audio/wav"]}
        maxSizeMB={50}
        width="400px"
        height="120px"
        required
      />

      <div>
        <strong>Selected File:</strong> {audioFile ? audioFile.name : "None"}
      </div>
      <div>
        <strong>Field Valid:</strong> {isValid ? "Yes" : "No"}
      </div>

      {/* Example with preloaded audio */}
      <AudioUpload
        label="Preloaded Audio"
        setResult={(file) => console.log("Preloaded audio changed:", file)}
        color="#FF5969"
        value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        width="400px"
        height="120px"
      />
    </div>
  );
};
