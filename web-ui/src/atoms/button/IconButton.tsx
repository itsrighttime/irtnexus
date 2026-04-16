"use client";

import React from "react";
import styles from "./IconButton.module.css";
import { Tooltip } from "../tooltip/Tooltip";

type IconButtonProps = {
  icon: React.ReactNode | string;
  onClick?: () => void;
  color?: string;
  style?: React.CSSProperties;
  size?: string | number;
  label?: string | null;
  isBorder?: boolean;
  disabled?: boolean;
  hoverBackground?: boolean;
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  color = "var(--color-primary)",
  style = {},
  size = "1",
  label = null,
  isBorder = false,
  disabled = false,
  hoverBackground = false,
}) => {
  const colorStyle: React.CSSProperties = {
    ["--iconColor" as any]: color,
    ["--iconSize" as any]: `calc(var(--font-size) * ${size})`,
    ["--border" as any]: isBorder ? `1px solid ${color}` : "none",
    opacity: disabled ? 0.6 : 1,
  };

  const isImage = typeof icon === "string";

  return (
    <div className={styles.iconButton} style={colorStyle}>
      <Tooltip content={label}>
        <button
          type="button"
          className={`${styles.btn} ${hoverBackground ? styles.hoverBg : ""}`}
          onClick={disabled ? undefined : onClick}
          style={{ ...style, ...colorStyle }}
          disabled={disabled}
        >
          {isImage ? (
            <img src={icon} className={styles.image} alt={label || "icon"} />
          ) : (
            icon
          )}
        </button>
      </Tooltip>
    </div>
  );
};
