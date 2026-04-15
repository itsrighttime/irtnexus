"use client";

import React, { useState, useEffect, type CSSProperties } from "react";
import styles from "./SelectionBox.module.css";
import { Icons } from "@/assets/icons";
import { Button } from "../button/Button";

const { tickSingleIcon } = Icons;

interface Option {
  value: string | number;
  label: string;
  help?: string;
  disabled?: boolean;
}

interface CustomStyles {
  group?: CSSProperties;
  item?: CSSProperties;
  label?: CSSProperties;
}

interface SelectionBoxProps {
  options: Option[];
  initialSelectedValues?: Array<string | number>;
  setResult: (value: Array<string | number> | string | number | null) => void;
  multiple?: boolean;
  layout?: "vertical" | "horizontal";
  label?: string;
  color?: string;
  disabled?: boolean;
  customStyles?: CustomStyles;
  width?: string;
  required?: boolean;
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({
  options = [],
  initialSelectedValues = [],
  setResult,
  multiple = true,
  layout = "vertical",
  label,
  color,
  disabled = false,
  customStyles = {},
  width = "300px",
  required = false,
}) => {
  const [selectedValues, setSelectedValues] = useState<
    Array<string | number> | string | number | null
  >(multiple ? initialSelectedValues : initialSelectedValues[0] || null);

  useEffect(() => {
    if (
      initialSelectedValues?.length > 0 &&
      Array.isArray(selectedValues) &&
      !selectedValues?.length
    ) {
      setSelectedValues(initialSelectedValues);
    }
  }, [initialSelectedValues]);

  const handleChange = (value: string | number) => {
    let updatedSelections;
    if (multiple) {
      if (Array.isArray(selectedValues)) {
        updatedSelections = selectedValues.includes(value)
          ? selectedValues.filter((item) => item !== value)
          : [...selectedValues, value];
      } else {
        updatedSelections = [value];
      }
    } else {
      updatedSelections = value;
    }

    setSelectedValues(updatedSelections);
    setResult(updatedSelections);
  };

  const isValueSelected = (value: string | number) => {
    return multiple
      ? Array.isArray(selectedValues) && selectedValues.includes(value)
      : selectedValues === value;
  };

  const cssVariable: CSSProperties = {
    "--color": color || "var(--color-primary)",
    "--width": width,
  } as CSSProperties;

  const setIconColor = (option: Option) => {
    return disabled || option.disabled ? "#bbb9b9" : color;
  };

  const setIconStyle = (option: Option) => {
    return multiple
      ? {
          width: "25px",
          height: "25px",
          cursor: disabled || option.disabled ? "not-allowed" : "pointer",
        }
      : {
          width: "25px",
          height: "25px",
          cursor: disabled || option.disabled ? "not-allowed" : "pointer",
          borderRadius: "50%",
        };
  };

  return (
    <div
      className={`${styles.selectionGroup} ${styles[layout]}`}
      style={{ ...customStyles.group, ...cssVariable }}
      aria-labelledby={label}
    >
      {label && (
        <div className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </div>
      )}

      {options.map((option, index) => {
        const selectedOption = isValueSelected(option.value);
        return (
          <div
            key={option.value || index}
            className={`${styles.selectionItem} ${
              disabled || option.disabled ? styles.disabled : ""
            }`}
            style={customStyles.item}
          >
            <Button
              iconLeft={selectedOption ? tickSingleIcon : <></>}
              color={setIconColor(option)}
              style={setIconStyle(option)}
              iconOnly
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled && !option.disabled) handleChange(option.value);
              }}
            />
            <label
              className={`${styles.selectionLabel} ${
                (disabled || option.disabled) && styles.disabled
              } ${selectedOption && styles.selected}`}
              style={customStyles.label}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled && !option.disabled) handleChange(option.value);
              }}
            >
              {option.label}
            </label>

            {option.help && (
              <div
                className={`${styles.inlineHelp} ${
                  (disabled || option.disabled) && styles.disabled
                } ${selectedOption && styles.selected}`}
              >
                {option.help}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
