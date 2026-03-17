"use client";

import React, { type CSSProperties } from "react";
import styles from "./LoadingChat.module.css";

interface LoadingChatProps {
  color?: string;
  height?: string;
  width?: string;
}

export const LoadingChat: React.FC<LoadingChatProps> = ({
  color,
  height = "100%",
  width = "100%",
}) => {
  const cssVariables: CSSProperties = {
    ["--color" as any]: color || "var(--color-primary)",
    ["--height" as any]: height,
    ["--width" as any]: width,
  };

  return (
    <div className={styles.blobs} style={cssVariables}>
      <div className={styles.blobCenter}></div>
      <div className={styles.blob}></div>
      <div className={styles.blob}></div>
      <div className={styles.blob}></div>
      <div className={styles.blob}></div>
      <div className={styles.blob}></div>
      <div className={styles.blob}></div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style={{ display: "none" }}
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
