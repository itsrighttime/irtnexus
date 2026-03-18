"use client";

import React from "react";
import { SelectionBox } from "./SelectionBox";

type OptionType =
  | {
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

interface CheckboxGroupProps {
  options?: OptionType[];
  initialSelectedValues?: Array<string | number>;
  setResult: (value: Array<string | number> | string | number | null) => void;
  layout?: "vertical" | "horizontal";
  label?: string;
  color?: string;
  disabled?: boolean;
  customStyles?: CustomStyles;
  width?: string;
  required?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options = [],
  initialSelectedValues = [],
  setResult,
  layout = "vertical",
  label,
  color,
  disabled = false,
  customStyles = {},
  width = "300px",
  required = false,
}) => {
  // Normalize options (convert string → object)
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt,
  );

  return (
    <SelectionBox
      options={normalizedOptions}
      initialSelectedValues={initialSelectedValues}
      setResult={setResult}
      layout={layout}
      label={label}
      color={color}
      disabled={disabled}
      customStyles={customStyles}
      multiple={true}
      width={width}
      required={required}
    />
  );
};
