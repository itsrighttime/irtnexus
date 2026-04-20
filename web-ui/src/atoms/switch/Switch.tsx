"use client";

import React, { useState, type CSSProperties } from "react";
import styles from "./Switch.module.css";

interface CustomStyles {
  container?: CSSProperties;
  label?: CSSProperties;
}

export interface SwitchProps {
  initialValue: boolean;
  setResult: (value: boolean) => void;
  color?: string;
  label?: string;
  disabled?: boolean;
  customStyles?: CustomStyles;
  required?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  initialValue,
  setResult,
  color,
  label,
  disabled = false,
  customStyles = {},
  required = false,
}) => {
  const [switchValue, setSwitchValue] = useState<boolean>(initialValue);

  const handleToggle = () => {
    if (!disabled) {
      const newValue = !switchValue;
      setSwitchValue(newValue);
      setResult(newValue);
    }
  };

  const cssVariable: CSSProperties = {
    "--color": color || "var(--color-primary)",
  } as CSSProperties;

  return (
    <div
      className={styles.switchContainer}
      style={{ ...customStyles.container, ...cssVariable }}
    >
      {label && (
        <label className={styles.switchLabel} style={customStyles.label}>
          {label}
        </label>
      )}

      <div
        className={`${styles.switch} ${
          switchValue ? styles.checked : styles.unchecked
        } ${disabled ? styles.disabled : ""}`}
        onClick={handleToggle}
        role="switch"
        aria-checked={switchValue}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <div className={styles.switchHandle} />
      </div>

      {required && <p className={styles.required}>*</p>}
    </div>
  );
};
