"use client";

import { useState, type JSX } from "react";
import styles from "./CalendarBox.module.css";
import type { RenderMonthsProps } from "./Calendar.types";

export const RenderMonths: React.FC<RenderMonthsProps> = ({
  isSmall = false,
  year,
  handleMonthClick,
  restrictionStartDate,
  restrictionEndDate,
}) => {
  const months: JSX.Element[] = [];
  const [clicked, setClicked] = useState<number>(-1);

  const formatMonth = (month: number, year: number): string =>
    `${month.toString().padStart(2, "0")}-${year}`;

  for (let i = 0; i < 12; i++) {
    const cellDate = new Date(year, i, 1);

    // Check if the entire month is within the restriction range
    const startMonthCondition =
      !restrictionStartDate ||
      year > restrictionStartDate.getFullYear() ||
      (year === restrictionStartDate.getFullYear() &&
        i >= restrictionStartDate.getMonth());

    const endMonthCondition =
      !restrictionEndDate ||
      year < restrictionEndDate.getFullYear() ||
      (year === restrictionEndDate.getFullYear() &&
        i <= restrictionEndDate.getMonth());

    const isClicked = i === clicked;
    const isWithinRange = startMonthCondition && endMonthCondition;

    months.push(
      <div
        key={i}
        className={`${styles.contentBox}
        ${isClicked && isWithinRange ? styles.currentCell : ""}
         ${!isWithinRange ? styles.restrictedCells : ""}`}
        onClick={
          isWithinRange
            ? () => {
                handleMonthClick(formatMonth(i, year));
                setClicked(i);
              }
            : undefined
        }
      >
        {cellDate.toLocaleString("default", { month: "short" })}
      </div>,
    );
  }

  return (
    <div className={`${styles.calendarBody} ${isSmall ? styles.isSmall : ""}`}>
      <div
        className={`${styles.calendar} ${styles.gridOf4} ${isSmall ? styles.isSmall : ""}`}
      >
        {months}
      </div>
    </div>
  );
};

export default RenderMonths;
