import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "./Calendar";
import styles from "./CalendarInput.module.css";
import type { BaseProps } from "@/types";

interface CalendarInputProps extends BaseProps {
  mode: "date" | "day" | "month" | "month-year" | "year";
  value?: string | number | null;
  onChange: (value: any) => void;
  placeholder?: string;
  restrictionStartDate?: string | null;
  restrictionEndDate?: string | null;
  label?: string;
  required?: boolean;
  variant?: "full" | "underline";
  color?: string;
}

const CalendarInput: React.FC<CalendarInputProps> = ({
  mode,
  value,
  onChange,
  placeholder = "",
  color,
  restrictionStartDate = null,
  restrictionEndDate = null,
  disabled = false,
  className,
  style,
  label,
  required = false,
  width = "300px",
  height = "40px",
  variant = "full",
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(value || "");
  const [inputWidth, setInputWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (containerRef.current) {
      setInputWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef.current?.offsetWidth]);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: any) => {
    setInternalValue(val);
    onChange(val);
    setOpen(false);
  };

  const inputStyle: React.CSSProperties = {
    borderColor: color || "var(--color-border)",
    borderWidth: variant === "underline" ? "0 0 2px 0" : undefined,
    borderStyle: variant === "underline" ? "solid" : undefined,
  };

  const cssVariable = {
    "--width": width,
    "--height": height,
  };

  return (
    <div
      className={`${styles.calendarInputWrapper} ${className || ""} ${styles[variant]}`}
      style={{ ...style, ...cssVariable }}
      ref={containerRef}
    >
      {/* Label */}
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.asterisk}>*</span>}
        </label>
      )}

      <div
        className={styles.inputBox}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        style={inputStyle}
      >
        <span style={{ color: color || "var(--color-text)" }}>
          {internalValue || placeholder}
        </span>
      </div>

      {open && (
        <div className={styles.dropdownCalendar} style={{ width: inputWidth }}>
          <Calendar
            mode={mode}
            setResult={handleSelect}
            color={color}
            restrictionStartDate={restrictionStartDate}
            restrictionEndDate={restrictionEndDate}
            isSmall
          />
        </div>
      )}
    </div>
  );
};

// Picker prop type
interface PickerProp extends Omit<CalendarInputProps, "mode"> {}

// Date Picker
export const DatePicker = (props: PickerProp) => (
  <CalendarInput {...props} mode="date" />
);
export const DayPicker = (props: PickerProp) => (
  <CalendarInput {...props} mode="day" />
);
export const MonthPicker = (props: PickerProp) => (
  <CalendarInput {...props} mode="month" />
);
export const MonthYearPicker = (props: PickerProp) => (
  <CalendarInput {...props} mode="month-year" />
);
export const YearPicker = (props: PickerProp) => (
  <CalendarInput {...props} mode="year" />
);
