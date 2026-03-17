import type { CSSProperties } from "react";

export type CalendarMode = "date" | "day" | "month" | "month-year" | "year";
export type CalendarView = "calendar" | "months" | "years";

export interface CalendarProps {
  isSmall?: boolean;
  setResult: (value: string | number) => void;
  color?: string;
  restrictionStartDate: string | null; // "dd-mm-yyyy"
  restrictionEndDate: string | null; // "dd-mm-yyyy"
  height?: string;
  width?: string;
  mode?: CalendarMode;
}

export interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (option: string) => void;
  color?: string;
  specialStyle?: CSSProperties;
}

export type Period = "month" | "year";

export type ComparisonType = "datewise" | "monthwise" | "yearwise";
export type DateInput = Date | string;

export type ViewType = "calendar" | "months" | "years";

export interface RenderCalendarProps {
  isSmall?: boolean;
  date: Date;
  handleDateClick: (formattedDate: string) => void;
  restrictionStartDate: Date | null;
  restrictionEndDate: Date | null;
}

export interface RenderMonthsProps {
  isSmall?: boolean;
  year: number;
  handleMonthClick: (monthYear: string) => void;
  restrictionStartDate: Date | null;
  restrictionEndDate: Date | null;
}

export interface RenderYearsProps {
  isSmall?: boolean;
  startYear: number;
  endYear: number;
  handleYearClick: (year: number) => void;
  restrictionStartYear: number | null;
  restrictionEndYear: number | null;
}
