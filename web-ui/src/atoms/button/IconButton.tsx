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
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  color = "var(color-primary)",
  style = {},
  size = "1",
  label = null,
  isBorder = false,
}) => {
  const colorStyle: React.CSSProperties = {
    ["--iconColor" as any]: color,
    ["--iconSize" as any]: `calc(var(--font-size) * ${size})`,
    ["--border" as any]: isBorder ? `1px solid ${color}` : "none",
  };

  const isImage = typeof icon === "string";

  return (
    <div className={styles.iconButton} style={colorStyle}>
      <Tooltip content={label}>
        {isImage ? (
          <img src={icon} className={styles.image} alt={label || "icon"} />
        ) : (
          <button
            type="button"
            className={styles.btn}
            onClick={onClick}
            style={{ ...style, ...colorStyle }}
          >
            {icon}
          </button>
        )}
      </Tooltip>
    </div>
  );
};
