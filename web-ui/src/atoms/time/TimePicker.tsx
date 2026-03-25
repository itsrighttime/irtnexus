"use client";

import { useState, useEffect } from "react";
import styles from "./TimePicker.module.css";
import type { BaseProps } from "@/types";
import { CustomDropdown } from "./CustomDropdown";

interface TimePickerProps extends BaseProps {
  label?: string;
  value?: string;
  setResult: (time: string) => void;
  width?: string;
  required?: boolean;

  // 🔥 New Config
  minTime?: string; // "08:30 AM"
  maxTime?: string; // "06:00 PM"
  minuteStep?: number; // default: 1
  hourStep?: number; // default: 1
}

/* -------------------- Helpers -------------------- */

// Convert "hh:mm AM/PM" → total minutes
const convertToMinutes = (time: string): number => {
  const [t, p] = time.split(" ");
  const [h, m] = t.split(":").map(Number);

  let hours = h % 12;
  if (p === "PM") hours += 12;

  return hours * 60 + m;
};

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value = "--:-- --",
  setResult,
  width = "300px",
  required = false,

  minTime,
  maxTime,
  minuteStep = 1,
  hourStep = 1,

  // BaseProps
  className,
  style,
  id,
  size = "medium",
  radius = "md",
  color,
  disabled = false,
  onChange,
  ariaLabel,
}) => {
  const [_time, _period] = value.split(" ");
  const [_hour, _minute] = _time.split(":");

  const [hours, setHours] = useState<string>(_hour);
  const [minutes, setMinutes] = useState<string>(_minute);
  const [period, setPeriod] = useState<string>(_period);

  /* -------------------- Sync with value -------------------- */
  useEffect(() => {
    const [_time, _p] = value.split(" ");
    const [_h, _m] = _time.split(":");

    setHours(_h || "--");
    setMinutes(_m || "--");
    setPeriod(_p || "--");
  }, [value]);

  /* -------------------- Validation -------------------- */
  const isValidTime = (h: string, m: string, p: string): boolean => {
    if (h === "--" || m === "--" || p === "--") return false;

    const current = convertToMinutes(`${h}:${m} ${p}`);

    if (minTime && current < convertToMinutes(minTime)) return false;
    if (maxTime && current > convertToMinutes(maxTime)) return false;

    return true;
  };

  const isTimeInvalid = !isValidTime(hours, minutes, period);

  const notifyTimeChange = (h: string, m: string, p: string) => {
    if (!isValidTime(h, m, p)) return;

    const formattedTime = `${h}:${m} ${p}`;
    setResult(formattedTime);
    onChange?.(formattedTime);
  };

  /* -------------------- Handlers -------------------- */
  const handleHoursChange = (val: string) => {
    setHours(val);
    notifyTimeChange(val, minutes, period);
  };

  const handleMinutesChange = (val: string) => {
    setMinutes(val);
    notifyTimeChange(hours, val, period);
  };

  const handlePeriodChange = (val: string) => {
    setPeriod(val);
    notifyTimeChange(hours, minutes, val);
  };

  /* -------------------- Options (Dynamic) -------------------- */
  const hoursOptions: string[] = Array.from(
    { length: Math.ceil(12 / hourStep) },
    (_, i) => String(i * hourStep + 1).padStart(2, "0"),
  );

  const minutesOptions: string[] = Array.from(
    { length: Math.ceil(60 / minuteStep) },
    (_, i) => String(i * minuteStep).padStart(2, "0"),
  );

  const periodOptions: string[] = ["AM", "PM"];

  /* -------------------- Classes -------------------- */
  const containerClasses = [
    styles.timeInputContainer,
    styles[size],
    styles[`radius-${radius}` as keyof typeof styles],
    disabled ? styles.disabled : "",
    className || "",
  ].join(" ");

  /* -------------------- Render -------------------- */
  return (
    <div
      id={id}
      className={containerClasses}
      style={{ maxWidth: width, ...style }}
      aria-label={ariaLabel}
    >
      {/* Header */}
      <div className={styles.timeHeader}>
        {label && <label className={styles.label}>{label}</label>}
        {required && <p className={styles.required}>*</p>}
      </div>

      {/* Selectors */}
      <div className={styles.timeSelectors}>
        <CustomDropdown
          options={hoursOptions}
          value={hours}
          onChange={handleHoursChange}
          color={color}
          error={isTimeInvalid}
        />

        <span className={styles.colon}>
          <svg width="8" height="8" viewBox="0 0 8 8">
            <path fill="currentColor" d="M4 3V2h1v1m0 3H4V5h1" />
          </svg>
        </span>

        <CustomDropdown
          options={minutesOptions}
          value={minutes}
          onChange={handleMinutesChange}
          color={color}
          error={isTimeInvalid}
        />

        <CustomDropdown
          options={periodOptions}
          value={period}
          onChange={handlePeriodChange}
          color={color}
          error={isTimeInvalid}
        />
      </div>
      {isTimeInvalid && (
        <div className={styles.timeHeader}>
          <p className={styles.error}>
            {minTime && maxTime
              ? `${minTime} - ${maxTime}`
              : minTime
                ? `${minTime} - no max`
                : maxTime
                  ? `no min - ${maxTime}`
                  : "no time specified"}
          </p>
        </div>
      )}
    </div>
  );
};
