"use client";

import { useState, type JSX } from "react";
import styles from "./CalendarBox.module.css";
import type { RenderCalendarProps } from "./Calendar.types";

export const RenderCalendar: React.FC<RenderCalendarProps> = ({
  isSmall = false,
  date,
  handleDateClick,
  restrictionStartDate,
  restrictionEndDate,
}) => {
  const [clicked, setClicked] = useState<Date>(new Date());

  const calendarDates: JSX.Element[] = [];
  const month = date.getMonth();
  const year = date.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // Add empty boxes for days before the first day
  for (let i = 0; i < firstDay; i++) {
    calendarDates.push(
      <div key={`empty-${i}`} className={styles.emptyBox}></div>,
    );
  }

  const formatDate = (date: Date): string =>
    `${date.getDate().toString().padStart(2, "0")}-${date
      .getMonth()
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;

  // Add calendar days
  for (let i = 1; i <= lastDate; i++) {
    const cellDate = new Date(year, month, i);
    const isClicked = cellDate.toDateString() === clicked.toDateString();

    // Check if cellDate is within the restriction range
    const isWithinRange =
      (!restrictionStartDate || cellDate >= restrictionStartDate) &&
      (!restrictionEndDate || cellDate <= restrictionEndDate);

    calendarDates.push(
      <div
        key={i}
        className={`${styles.contentBox} ${
          isClicked && isWithinRange ? styles.currentCell : ""
        } ${!isWithinRange ? styles.restrictedCells : ""}`}
        onClick={
          isWithinRange
            ? () => {
                handleDateClick(formatDate(cellDate));
                setClicked(cellDate);
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
        className={`${styles.calendarDays} ${isSmall ? styles.isSmall : ""}`}
      >
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>
      <div className={`${styles.calendar} ${isSmall ? styles.isSmall : ""}`}>
        {calendarDates}
      </div>
    </div>
  );
};

export default RenderCalendar;
