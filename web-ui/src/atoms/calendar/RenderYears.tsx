"use client";

import { useState, type JSX } from "react";
import styles from "./CalendarBox.module.css";
import type { RenderYearsProps } from "./Calendar.types";

export const RenderYears: React.FC<RenderYearsProps> = ({
  isSmall = false,
  startYear,
  endYear,
  handleYearClick,
  restrictionStartYear,
  restrictionEndYear,
}) => {
  const years: JSX.Element[] = [];
  const [clicked, setClicked] = useState<number>(-1);

  for (let i = startYear; i <= endYear; i++) {
    // Check if the year is within the restriction range
    const isWithinRange =
      (!restrictionStartYear || i >= restrictionStartYear) &&
      (!restrictionEndYear || i <= restrictionEndYear);

    const isClicked = i === clicked;

    years.push(
      <div
        key={i}
        className={`${styles.contentBox} 
         ${isClicked && isWithinRange ? styles.currentCell : ""}
        ${!isWithinRange ? styles.restrictedCells : ""}`}
        onClick={
          isWithinRange
            ? () => {
                handleYearClick(i);
                setClicked(i);
              }
            : undefined
        }
      >
        {i}
      </div>,
    );
  }

  return (
    <div className={`${styles.calendarBody} ${isSmall ? styles.isSmall : ""}`}>
      <div
        className={`${styles.calendar} ${isSmall ? styles.isSmall : ""} ${styles.gridOf4}`}
      >
        {years}
      </div>
    </div>
  );
};

export default RenderYears;
