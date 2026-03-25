"use client";

import {
  Calendar,
  DatePicker,
  DayPicker,
  MonthPicker,
  MonthYearPicker,
  YearPicker,
} from "@/atoms";
import React, { useState } from "react";

export const TestCalendar: React.FC = () => {
  // State to hold selected result (date, month-year, or year)
  const [selectedValue, setSelectedValue] = useState<string | number>("");
  const isSmall = false;

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Calendar Component</h1>

      <div style={{ marginBottom: 40 }}>
        <h2>Date Mode (dd-mm-yyyy)</h2>
        <DatePicker
          onChange={(value) => setSelectedValue(value)}
          restrictionStartDate="01-01-2024"
          restrictionEndDate="31-12-2024"
          color="#00bcd4"
          value={"16-06-2025"}
        />
        <p>Selected: {selectedValue}</p>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2>Day Mode (dd)</h2>
        <DayPicker
          onChange={(value) => setSelectedValue(value)}
          restrictionStartDate="01-01-2024"
          restrictionEndDate="31-12-2024"
          color="#00bcd4"
        />
        <p>Selected: {selectedValue}</p>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2>Month-Year Mode (MM-YYYY)</h2>
        <MonthPicker
          onChange={(value) => setSelectedValue(value)}
          restrictionStartDate="01-03-2023"
          restrictionEndDate="31-10-2025"
          color="#ff5722"
        />
        <p>Selected: {selectedValue}</p>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2>Month Only Mode (0-11)</h2>
        <MonthYearPicker
          onChange={(value) => setSelectedValue(value)}
          restrictionStartDate="01-01-2023"
          restrictionEndDate="31-12-2024"
          color="#4caf50"
        />
        <p>Selected Month Index: {selectedValue}</p>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2>Year Only Mode</h2>
        <YearPicker
          onChange={(value) => setSelectedValue(value)}
          restrictionStartDate="01-01-1020"
          restrictionEndDate="31-12-2030"
          color="#9c27b0"
        />
        <p>Selected Year: {selectedValue}</p>
      </div>
    </div>
  );
};
