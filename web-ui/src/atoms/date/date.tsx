"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../css/DatePicker.module.css";
import { getCommonCssVariables } from "./getCommonCssVariables ";
import { Calendar } from "../calendar/Calendar";

type ModeType = "date" | "month" | "month-year" | "year";

interface DatePickerProps {
  label?: string;
  initialDate?: string | null;
  restrictionStartDate?: string | null;
  restrictionEndDate?: string | null;
  color?: string;
  setResult: (value: string | number) => void;
  isSmall?: boolean;
  isBorder?: boolean;
  width?: string;
  mode?: ModeType;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  initialDate = null,
  restrictionStartDate = null,
  restrictionEndDate = null,
  color,
  setResult,
  isSmall = true,
  isBorder = false,
  width = "200px",
  mode = "date",
  required = false,
}) => {
  const _label = label || "Select a Date";

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | number>(
    initialDate === null ? _label : initialDate,
  );

  const pickerRef = useRef<HTMLDivElement | null>(null);

  const handleDateClick = (date: string | number) => {
    setSelectedDate(date);
    setResult(date);
    setIsOpen(false);
  };

  useEffect(() => {
    if (initialDate !== null && selectedDate === _label) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cssVariable: React.CSSProperties = {
    ...getCommonCssVariables(isBorder, color, width),
  };

  return (
    <div className={styles.datePicker} ref={pickerRef} style={cssVariable}>
      {required && <p className={styles.required}>*</p>}

      <div className={styles.dateInput} onClick={() => setIsOpen(true)}>
        {selectedDate}
      </div>

      {isOpen && (
        <div className={styles.calendar}>
          <Calendar
            isSmall={isSmall}
            setResult={handleDateClick}
            color={color}
            restrictionStartDate={restrictionStartDate}
            restrictionEndDate={restrictionEndDate}
            mode={mode}
          />
        </div>
      )}
    </div>
  );
};
