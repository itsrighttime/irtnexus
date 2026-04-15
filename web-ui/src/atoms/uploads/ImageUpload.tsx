"use client";

import { useState, useEffect, type ChangeEvent, type DragEvent } from "react";
import style from "./ImageUpload.module.css"; // Adjust path as needed
import { Icons } from "@/assets/icons";
import { IconButton } from "../button/IconButton";

const { crossIcon, resetFieldIcon } = Icons;

interface ImageUploadProps {
  label?: string;
  setResult: (file: File | null) => void;
  color?: string;
  setIsFieldValid?: (isValid: boolean) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  requireSquare?: boolean;
  width?: string;
  height?: string;
  previewBorderRadius?: string;
  backendError?: string;
  value?: File | string | null | any;
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = "Upload Image",
  setResult,
  color,
  setIsFieldValid = () => {},
  allowedTypes = ["image/jpeg", "image/png", "image/gif"],
  maxSizeMB = 5,
  requireSquare = true,
  width = "300px",
  height = "300px",
  previewBorderRadius = "0%",
  backendError = "",
  value = null,
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<string | null>(null); // URL for preview
  const [error, setError] = useState<string | null>(null);

  const maxSize = maxSizeMB * 1024 * 1024;

  // Initialize image from value prop
  useEffect(() => {
    if (!value) {
      setImage(null);
      return;
    }

    if (typeof value === "string") {
      setImage(value);
      setIsFieldValid(true);
      setError(null);
    } else if (value instanceof File || value instanceof Blob) {
      const url = URL.createObjectURL(value);
      setImage(url);
      setIsFieldValid(true);
      setError(null);

      return () => URL.revokeObjectURL(url);
    }
  }, [value, setIsFieldValid]);

  // Sync backend error
  useEffect(() => {
    if (backendError) {
      setError(backendError);
      setIsFieldValid(false);
    }
  }, [backendError, setIsFieldValid]);

  // Cleanup previous object URL
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  // Validate file type and size
  const validateImage = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid image type. Allowed types: ${allowedTypes.join(", ")}`);
      return false;
    }
    if (file.size > maxSize) {
      setError(`Image size exceeds limit of ${maxSizeMB} MB`);
      return false;
    }
    return true;
  };

  const checkIfSquare = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width === img.height);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const handleFileChange = async (selectedFile: File | null) => {
    if (!selectedFile || !validateImage(selectedFile)) return;

    const url = URL.createObjectURL(selectedFile);
    const isSquare = await checkIfSquare(url);

    if (requireSquare && !isSquare) {
      setError("Image must be square. Please reupload.");
      URL.revokeObjectURL(url);
      resetAll();
    } else {
      setImage(url);
      setResult(selectedFile);
      setIsFieldValid(true);
      setError(null);
    }
  };

  const resetAll = () => {
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setResult(null);
    setIsFieldValid(false);
  };

  const handleDrag = (e: DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleReupload = () => {
    if (typeof document === "undefined") return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = allowedTypes.join(",");
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const selectedFile = target.files?.[0] || null;
      handleFileChange(selectedFile);
    };
    fileInput.click();
  };

  const cssVariable: React.CSSProperties = {
    "--color": color || "var(--colorCyan)",
    "--width": width,
    "--height": height,
  } as React.CSSProperties;

  return (
    <div className={style.imageUploadContainer} style={cssVariable}>
      {required && <p className={style.required}>*</p>}

      {!image && (
        <label
          className={`${style.imageUpload} ${isDragging ? style.dragging : ""}`}
          onDragEnter={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleFileChange(e.target.files?.[0] || null)
            }
            className={style.formControl}
            accept={allowedTypes.join(",")}
          />
          <span className={style.label}>{label}</span>
          <span className={style.label}>{`(Max Size: ${maxSizeMB}MB)`}</span>
        </label>
      )}

      {image && (
        <div className={style.imagePreview}>
          <img
            src={image}
            alt="Preview"
            className={style.image}
            style={{ borderRadius: previewBorderRadius }}
          />
          <div className={style.resetRemove}>
            <IconButton
              icon={resetFieldIcon}
              onClick={handleReupload}
              color={color || "#52C9BD"}
              label="Re-Upload"
            />
            <IconButton icon={crossIcon} onClick={resetAll} color="#FF5969" />
          </div>
        </div>
      )}

      {error && <p className={style.error}>{error}</p>}
    </div>
  );
};
