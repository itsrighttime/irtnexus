"use client";

import { useState, useEffect, type ChangeEvent, type DragEvent } from "react";
import styles from "./FileUpload.module.css";
import { Icons } from "@/assets";
import { getFileTypeLabel } from "./getFileType.heper";
import { formatFileSize } from "./formatFileSize.helper";
import { IconButton } from "../button/IconButton";

const { crossIcon, resetFieldIcon } = Icons;

interface FileUploadProps {
  value?: File[];
  label?: string;
  setResult: (files: File[]) => void;
  color?: string;
  setIsFieldValid?: (isValid: boolean) => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
  maxFiles?: number;
  width?: string;
  height?: string;
  backendError?: string;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  value = [],
  label = "Upload File",
  setResult,
  color,
  setIsFieldValid = () => {},
  allowedTypes = [],
  maxSize = Infinity,
  multiple = false,
  maxFiles = Infinity,
  width = "300px",
  height = "200px",
  backendError = "",
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>(value || []);
  const [error, setError] = useState<string | null>(null);

  const _maxSize = maxSize * 1024 * 1024;

  useEffect(() => {
    if (value.length > 0 && files.length === 0) setFiles(value);
  }, [value]);

  useEffect(() => {
    if (backendError) {
      setError(backendError);
      setIsFieldValid(false);
    }
  }, [backendError]);

  const validateFile = (file: File): boolean => {
    if (allowedTypes.length && !allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`);
      return false;
    }
    if (file.size > _maxSize) {
      setError(`File size exceeds limit of ${maxSize} MB`);
      return false;
    }
    return true;
  };

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    let newFileArray = Array.from(selectedFiles).filter(validateFile);

    newFileArray = newFileArray.filter(
      (newFile) =>
        !files.some((f) => f.name === newFile.name && f.size === newFile.size),
    );

    if (newFileArray.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    if (newFileArray.length > 0) {
      const updatedFiles = [...files, ...newFileArray];
      setFiles(updatedFiles);
      setResult(updatedFiles);
      setIsFieldValid(true);
      setError("");
    } else {
      setIsFieldValid(false);
    }
  };

  const createFileInput = ({
    multiple = false,
    onChange,
  }: {
    multiple?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }) => {
    if (typeof document === "undefined") return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = allowedTypes.join(",");
    input.multiple = multiple;
    input.onchange = onChange as any; // TypeScript requires casting
    input.click();
  };

  const handleReupload = (index: number) => {
    createFileInput({
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        if (!target.files || !target.files[0]) return;
        const selectedFile = target.files[0];
        if (validateFile(selectedFile)) {
          const newFiles = [...files];
          newFiles[index] = selectedFile;
          setFiles(newFiles);
          setResult(newFiles);
          setIsFieldValid(true);
          setError("");
        } else {
          setIsFieldValid(false);
        }
      },
    });
  };

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    setResult(updated);
    setIsFieldValid(updated.length > 0);
    if (updated.length === 0) setError("");
  };

  const handleResetFile = () => {
    setFiles([]);
    setResult([]);
    setIsFieldValid(false);
    setError("");
  };

  const handleAddMoreFiles = () => {
    createFileInput({
      multiple: true,
      onChange: (e) => handleFileChange((e.target as HTMLInputElement).files),
    });
  };

  const handleFilePreview = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
    setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
  };

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
    if (e.dataTransfer.files?.length) {
      handleFileChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
    e.target.value = ""; // reset for re-selection
  };

  const cssVariable = {
    "--color": color || "var(--colorCyan)",
    "--width": width,
    "--height": height,
  } as React.CSSProperties;

  return (
    <div className={styles.fileUploadContainer} style={cssVariable}>
      {required && <p className={styles.required}>*</p>}

      {files.length === 0 && (
        <div
          className={`${styles.fileUpload} ${isDragging ? styles.dragging : ""}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleInputChange}
            className={styles.formControl}
            title=""
            aria-label={label}
            multiple={multiple}
          />
          <span className={styles.label}>{label}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className={styles.infor} style={cssVariable}>
          <div className={styles.inforDiv}>
            {files.map((file, index) => (
              <div key={index} className={styles.fileInfo}>
                <p
                  onClick={() => handleFilePreview(file)}
                  className={styles.fileName}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleFilePreview(file)
                  }
                >
                  {`${getFileTypeLabel(file.type) || "File"}: ${file.name}`}
                </p>
                <div className={styles.uploadRemove}>
                  <p>{formatFileSize(file.size)}</p>
                  <IconButton
                    icon={resetFieldIcon}
                    onClick={() => handleReupload(index)}
                    color={color || "#52C9BD"}
                    label={"Re-Upload"}
                  />
                  <IconButton
                    icon={crossIcon}
                    onClick={() => handleRemoveFile(index)}
                    color="#FF5969"
                    label={"Remove"}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <p className={styles.fileCount}>
              {maxFiles === Infinity
                ? `(Files Uploaded: ${files.length})`
                : `(Files Uploaded: ${files.length} / ${maxFiles})`}
            </p>
            <p className={styles.buttonLink} onClick={handleResetFile}>
              Reset All
            </p>
            {multiple && files.length < maxFiles && (
              <p className={styles.buttonLink} onClick={handleAddMoreFiles}>
                Add More Files
              </p>
            )}
          </div>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};
