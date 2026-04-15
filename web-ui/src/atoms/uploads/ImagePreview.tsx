"use client";

import { useState, useEffect } from "react";
import { Icons } from "@/assets/icons";
import { IconError } from "../error/IconError";

const { imageNotIcon } = Icons;

interface ImagePreviewProps {
  image: File | string | null;
  radius?: string;
  width?: string;
  height?: string;
  alt?: string;
}

/**
 * `ImagePreview` displays an image preview from a URL or a File object.
 * Shows an error icon if the image is invalid or missing.
 */
export const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  radius = "8px",
  width = "200px",
  height = "200px",
  alt = "Preview",
}) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      setImgUrl(null);
      return;
    }

    if (typeof image === "string") {
      setImgUrl(image);
      return;
    }

    if (image instanceof File && image.type.startsWith("image/")) {
      const url = URL.createObjectURL(image);
      setImgUrl(url);

      return () => URL.revokeObjectURL(url); // cleanup object URL
    }

    console.warn("Invalid image input provided to ImagePreview.");
    setImgUrl(null);
  }, [image]);

  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f8f8",
        border: "1px solid var(--colorGray3)",
      }}
    >
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: radius,
          }}
        />
      ) : (
        <IconError
          icon={imageNotIcon}
          message="Ah! Looks like the image is not found."
          size={2}
        />
      )}
    </div>
  );
};
