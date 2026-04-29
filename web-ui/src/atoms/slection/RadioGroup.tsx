"use client";

import React from "react";
import { SelectionBox } from "./SelectionBox";

type OptionType =
  | {
      key: string | number;
      value: string | number;
      label: string;
      help?: string;
      disabled?: boolean;
    }
  | string;

interface CustomStyles {
  group?: React.CSSProperties;
  item?: React.CSSProperties;
  label?: React.CSSProperties;
}

export interface RadioGroupProps {
  options: OptionType[];
  value?: string | number;
  setResult: (value: string | number | null) => void;
  layout?: "vertical" | "horizontal";
  label?: string;
  color?: string;
  disabled?: boolean;
  customStyles?: CustomStyles;
  width?: string;
  required?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options = [],
  value: initialSelectedValue,
  setResult,
  layout = "vertical",
  label,
  color,
  disabled = false,
  customStyles = {},
  width = "300px",
  required = false,
}) => {
  // Normalize options to match SelectionBox expected format
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt,
  );

  return (
    <SelectionBox
      options={normalizedOptions}
      value={
        initialSelectedValue !== undefined ? [initialSelectedValue] : []
      }
      setResult={(val) => {
        // SelectionBox returns single value when multiple=false
        setResult(val as string | number | null);
      }}
      layout={layout}
      label={label}
      color={color}
      disabled={disabled}
      customStyles={customStyles}
      multiple={false}
      width={width}
      required={required}
    />
  );
};
