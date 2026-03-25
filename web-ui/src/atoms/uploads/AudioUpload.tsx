"use client";

import { useState, useEffect } from "react";
import style from "./AudioUpload.module.css";
import { AudioPlayer } from "./AudioPlayer";
import React from "react";

type AudioUploadProps = {
  label: string;
  setResult: (file: File | null) => void;
  color?: string;
  setIsFieldValid?: (isValid: boolean) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  width?: string;
  height?: string;
  value?: string | File | Blob | null;
  backendError?: string;
  required?: boolean;
};

export const AudioUpload: React.FC<AudioUploadProps> = ({
  label,
  setResult,
  color,
  setIsFieldValid = () => {},
  allowedTypes = ["audio/mpeg", "audio/wav"],
  maxSizeMB = 10,
  width = "500px",
  height = "100px",
  backendError = "",
  value = null,
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [audio, setAudio] = useState<string | null>(
    typeof value === "string" ? value : null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setAudio(null);
      return;
    }

    if (typeof value === "string") {
      setAudio(value);
      setError(null);
    } else if (value instanceof File || value instanceof Blob) {
      const url = URL.createObjectURL(value);
      setAudio(url);
      setError(null);

      return () => URL.revokeObjectURL(url); // cleanup
    }
  }, [value]);

  const maxSize = maxSizeMB * 1024 * 1024;

  useEffect(() => {
    if (backendError) {
      setError(backendError);
      setIsFieldValid(false);
    }
  }, [backendError, setIsFieldValid]);

  const validateAudio = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid audio type. Allowed types: ${allowedTypes.join(", ")}`);
      return false;
    }
    if (file.size > maxSize) {
      setError(`Audio size exceeds limit of ${maxSizeMB} MB`);
      return false;
    }
    setError(null);
    return true;
  };

  const processFile = (file: File) => {
    if (!file || !validateAudio(file)) {
      setIsFieldValid(false);
      return;
    }

    if (backendError) setError("");

    setAudio(URL.createObjectURL(file));
    setResult(file);
    setIsFieldValid(true);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragState =
    (state: boolean) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(state);
    };

  const handleReupload = () => {
    if (typeof document === "undefined") return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = allowedTypes.join(",");
    input.onchange = (e: any) => {
      if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
    };
    input.click();
  };

  const handleRemoveAudio = () => {
    setAudio(null);
    setResult(null);
    setIsFieldValid(false);
  };

  const cssVariable: React.CSSProperties = {
    "--color": color || "var(--colorCyan)",
    "--width": width,
    "--height": height,
  } as React.CSSProperties;

  return (
    <div className={style.audioUploadContainer} style={cssVariable}>
      {required && <p className={style.required}>*</p>}

      {!audio ? (
        <div
          className={`${style.audioUpload} ${isDragging ? style.dragging : ""}`}
          onDragEnter={handleDragState(true)}
          onDragLeave={handleDragState(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={cssVariable}
        >
          <input
            type="file"
            onChange={handleFileInput}
            className={style.formControl}
            accept={allowedTypes.join(",")}
          />
          <span className={style.label}>{label}</span>
          <span className={style.label}>{`(Max Size: ${maxSizeMB}MB)`}</span>
        </div>
      ) : (
        <AudioPlayer
          audioSrc={audio}
          onRemove={handleRemoveAudio}
          onReupload={handleReupload}
          color={color}
          width={width}
        />
      )}
      {error && <p className={style.error}>{error}</p>}
    </div>
  );
};
