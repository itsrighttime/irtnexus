"use client";

import { useState, useEffect, type ChangeEvent, type DragEvent } from "react";
import style from "./VideoUpload.module.css"; // Adjust the path as necessary
import { VideoPlayer } from "./VideoPlayer";
import { Icons } from "@/assets/icons/index.js";
import { formatFileSize } from "./formatFileSize.helper";
import { IconButton } from "../button/IconButton.js";

const { crossIcon, resetFieldIcon } = Icons;

export interface VideoUploadProps {
  label?: string;
  color?: string;
  setResult: (file: File | null) => void;
  setIsFieldValid?: (isValid: boolean | null) => void;
  allowedTypes?: string[];
  maxSizeMb?: number;
  preview?: boolean;
  width?: string;
  height?: string;
  backendError?: string;
  value?: File | Blob | string | null;
  required?: boolean;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  label = "Upload Video",
  color,
  setResult,
  setIsFieldValid = () => {},
  allowedTypes = ["video/mp4", "video/webm"],
  maxSizeMb: maxSizeMB = 50,
  preview = false,
  width = "300px",
  height = "200px",
  backendError,
  value = null,
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [video, setVideo] = useState<File | Blob | string | null>(value);
  const [error, setError] = useState<string | null>(null);

  const maxSize = maxSizeMB * 1024 * 1024;
  const formattedMaxSize = formatFileSize(maxSize);

  // Handle initial value / preloaded video
  useEffect(() => {
    if (!value) {
      setVideo(null);
      return;
    }

    if (typeof value === "string") {
      setVideo(value);
      setError(null);
    } else if (value instanceof File || value instanceof Blob) {
      const url = URL.createObjectURL(value);
      setVideo(url);
      setError(null);

      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  // Handle backend error
  useEffect(() => {
    if (backendError) {
      setError(backendError);
      setIsFieldValid(false);
    }
  }, [backendError, setIsFieldValid]);

  // Validate file type and size
  const validateVideo = (file: File | Blob) => {
    if (file instanceof File && !allowedTypes.includes(file.type)) {
      setError(`Invalid video type. Allowed types: ${allowedTypes.join(", ")}`);
      return false;
    }
    if (file.size > maxSize) {
      setError(`Video size exceeds limit of ${formattedMaxSize}`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;
    if (backendError) setError(null);

    if (validateVideo(selectedFile)) {
      setVideo(selectedFile);
      setResult(selectedFile);
      setIsFieldValid(true);
      setError(null);
    } else {
      setVideo(null);
      setResult(null);
      setIsFieldValid(false);
    }
  };

  // Drag & drop handlers
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleRemoveVideo = () => {
    setVideo(null);
    setResult(null);
    setIsFieldValid(null);
  };

  const handleReupload = () => {
    if (typeof document === "undefined") return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = allowedTypes.join(",");
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const selectedFile = target.files?.[0];
      if (selectedFile && validateVideo(selectedFile)) {
        handleFileChange(selectedFile);
      }
    };
    fileInput.click();
  };

  const cssVariable: React.CSSProperties = {
    "--color": color || "var(--color-primary)",
    "--width": width,
    "--height": height,
  } as React.CSSProperties;

  // Helper to safely get name/size if File
  const getVideoName = () =>
    video instanceof File ? video.name : "Uploaded Video";
  const getVideoSize = () =>
    video instanceof File ? formatFileSize(video.size) : "";

  return (
    <div className={style.videoUploadContainer} style={cssVariable}>
      {label && <p className={style.label}>{label}</p>}
      {required && <p className={style.required}>*</p>}

      {!video && (
        <div
          className={`${style.videoUpload} ${isDragging ? style.dragging : ""}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleInputChange}
            className={style.formControl}
            accept={allowedTypes.join(",")}
          />
          <span className={style.label}>{label}</span>
          <span
            className={style.label}
          >{`(Max Size: ${formattedMaxSize})`}</span>
        </div>
      )}

      {video && !preview && (
        <div className={style.uploadDetails}>
          <p>Video Uploaded: {getVideoName()}</p>
          <div className={style.videoSizeIcon}>
            {video instanceof File && <p>{getVideoSize()}</p>}
            <IconButton
              icon={resetFieldIcon}
              onClick={handleReupload}
              color={color || "var(--color-primary)"}
              label="Re-Upload"
            />
            <IconButton
              icon={crossIcon}
              onClick={handleRemoveVideo}
              color="var(--color-error)"
            />
          </div>
        </div>
      )}

      {video && preview && (
        <VideoPlayer
          videoFile={video}
          onRemove={handleRemoveVideo}
          onReupload={handleReupload}
          color={color}
          width={"100%"}
          height={"auto"}
        />
      )}

      {error && <p className={style.error}>{error}</p>}
    </div>
  );
};
