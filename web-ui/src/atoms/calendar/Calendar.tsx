"use client";

import React, { useState, Suspense } from "react";
import styles from "./CalendarBox.module.css";
import { Icons } from "@/assets";
import { convertStrDate2Date } from "./handleDateChange";
import { isAfterDate } from "./handleDateCompare";
import {
  canMoveNext,
  canMovePrev,
  getHeaderText,
  handleMonthSelection,
  handleNext,
  handlePrev,
  handleViewChange,
  handleYearSelection,
} from "./helperCalnedar";
import { Button } from "../button/Button";
import { PRESETS } from "@/templates/index.js";
import type { CalendarProps, CalendarView } from "./Calendar.types.ts";
import { Loading } from "../loading/Loading.tsx";

const { arrowLeftIcon, arrowRightIcon } = Icons;

// Dynamically import subcomponents
const RenderCalendar = React.lazy(() => import("./RenderDates.tsx"));
const RenderMonths = React.lazy(() => import("./RenderMonths.tsx"));
const RenderYears = React.lazy(() => import("./RenderYears.tsx"));

export const Calendar: React.FC<CalendarProps> = ({
  isSmall = false,
  setResult,
  color,
  restrictionStartDate = null,
  restrictionEndDate = null,
  height = "100%",
  width = "100%",
  mode = "date",
}) => {
  // Convert string dates to Date objects
  let startDate: Date | null = restrictionStartDate
    ? convertStrDate2Date(restrictionStartDate)
    : null;
  let endDate: Date | null = restrictionEndDate
    ? convertStrDate2Date(restrictionEndDate)
    : null;

  if (startDate && endDate && isAfterDate(startDate, endDate)) {
    throw new Error("Start Date must be before End Date");
  }

  // Determine initial date to render
  const getInitialDate = (): Date => {
    const today = new Date();
    if (startDate && endDate) {
      if (today < startDate || today > endDate) {
        const centralTime = (startDate.getTime() + endDate.getTime()) / 2;
        return new Date(centralTime);
      }
    }
    return today;
  };

  // Determine initial view based on mode
  const getInitialView = (): CalendarView => {
    switch (mode) {
      case "year":
        return "years";
      case "month":
      case "month-year":
        return "months";
      case "day":
      case "date":
      default:
        return "calendar";
    }
  };

  const [currentDate, setCurrentDate] = useState<Date>(getInitialDate());
  const [view, setView] = useState<CalendarView>(getInitialView());

  const cssVariable: React.CSSProperties = {
    "--color": color || "var(--color-primary)",
    "--height": height,
    "--width": width,
  } as React.CSSProperties;

  return (
    <div
      className={`${styles.calendarBox} ${isSmall ? styles.isSmall : ""}`}
      style={cssVariable}
    >
      {mode !== "month" && (
        <div className={styles.calendarHeader}>
          {!startDate || canMovePrev(view, currentDate, startDate) ? (
            <Button
              variant={PRESETS.BUTTON.A.GHOST}
              size={isSmall ? PRESETS.BUTTON.B.SMALL : PRESETS.BUTTON.B.MEDIUM}
              iconOnly
              iconLeft={arrowLeftIcon}
              onClick={() =>
                handlePrev(currentDate, setCurrentDate, startDate, view)
              }
              color={color}
              tooltip="Previous"
            />
          ) : (
            <div></div>
          )}

          <h2 onClick={() => handleViewChange(setView, mode)}>
            {getHeaderText(currentDate, view)}
          </h2>

          {!endDate || canMoveNext(view, currentDate, endDate) ? (
            <Button
              variant={PRESETS.BUTTON.A.GHOST}
              size={isSmall ? PRESETS.BUTTON.B.SMALL : PRESETS.BUTTON.B.MEDIUM}
              iconOnly
              iconLeft={arrowRightIcon}
              onClick={() =>
                handleNext(currentDate, setCurrentDate, endDate, view)
              }
              color={color}
              tooltip="Next"
            />
          ) : (
            <div></div>
          )}
        </div>
      )}

      <Suspense
        fallback={
          <Loading color={color} windowHeight="200px" windowWidth="100%" />
        }
      >
        {view === "calendar" && (
          <RenderCalendar
            isSmall={isSmall}
            date={currentDate}
            handleDateClick={setResult}
            restrictionStartDate={startDate}
            restrictionEndDate={endDate}
          />
        )}

        {view === "months" && (
          <RenderMonths
            isSmall={isSmall}
            year={currentDate.getFullYear()}
            handleMonthClick={(monthYear: string) => {
              const [monthStr, yearStr] = monthYear.split("-");
              const month = parseInt(monthStr, 10);
              const year = parseInt(yearStr, 10);
              setCurrentDate(new Date(year, month, 1));

              if (mode === "month") {
                setResult(month);
              } else if (mode === "month-year") {
                setResult(`${month}-${year}`);
              } else {
                handleMonthSelection(monthYear, setCurrentDate, setView);
              }
            }}
            restrictionStartDate={startDate}
            restrictionEndDate={endDate}
          />
        )}

        {view === "years" && (
          <RenderYears
            isSmall={isSmall}
            startYear={currentDate.getFullYear() - 7}
            endYear={currentDate.getFullYear() + 8}
            handleYearClick={(year: number) => {
              setCurrentDate(new Date(year, 0, 1));
              if (mode === "year") {
                setResult(year);
              } else {
                handleYearSelection(year, setCurrentDate, setView);
              }
            }}
            restrictionStartYear={startDate ? startDate.getFullYear() : null}
            restrictionEndYear={endDate ? endDate.getFullYear() : null}
          />
        )}
      </Suspense>
    </div>
  );
};
