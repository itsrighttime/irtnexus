import React, { type CSSProperties } from "react";
import styles from "./PlainButton.module.css";

/* -------------------- Types -------------------- */

type PlainButtonProps = {
  onClick?: () => void;
  style?: CSSProperties;
  text?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  isUnderline?: boolean;
};

/* -------------------- Component -------------------- */

export const PlainButton: React.FC<PlainButtonProps> = ({
  onClick,
  style,
  text = "Click Me",
  color = "#52C9BD",
  fontSize = 1,
  fontWeight = 400,
  isUnderline = false,
}) => {
  const cssVariable: CSSProperties = {
    ["--color" as any]: color,
    ["--fontSize" as any]: `${fontSize}rem`,
    ["--fontWeight" as any]: fontWeight,
    ["--underline" as any]: isUnderline ? "underline" : "none",
    ["--underlineHover" as any]: isUnderline ? "none" : "underline",
  };

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={onClick}
      style={{ ...style, ...cssVariable }}
    >
      {text}
    </button>
  );
};
