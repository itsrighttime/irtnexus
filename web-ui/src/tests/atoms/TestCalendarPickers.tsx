import React, { useState } from "react";
import { DatePicker, DayPicker, MonthPicker, MonthYearPicker } from "@/atoms";

export const TestCalendarPickers: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedMonthYear, setSelectedMonthYear] = useState<string | null>(
    null,
  );

  return (
    <div style={{ padding: "40px", fontFamily: "var(--font-family)" }}>
      <h2>Calendar Pickers Test</h2>

      <div style={{ marginBottom: "20px" }}>
        <DatePicker
          label="Date Picker"
          required
          value={selectedDate}
          onChange={setSelectedDate}
          placeholder="Select a date"
          variant="full"
          color="#5b9bd5"
          restrictionStartDate="2023-01-01"
          restrictionEndDate="2024-12-31"
        />
        <p>Selected Date: {selectedDate || "None"}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <DayPicker
          label="Day Picker"
          value={selectedDay}
          onChange={setSelectedDay}
          placeholder="Select a day"
          variant="underline"
          color="#17a2b8"
          restrictionStartDate="2023-01-01"
          restrictionEndDate="2024-12-31"
        />
        <p>Selected Day: {selectedDay || "None"}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <MonthPicker
          label="Month Picker"
          required
          value={selectedMonth}
          onChange={setSelectedMonth}
          placeholder="Select a month"
          variant="full"
          color="#8a244b"
          restrictionStartDate="2023-01-01"
          restrictionEndDate="2024-12-31"
        />
        <p>
          Selected Month: {selectedMonth !== null ? selectedMonth + 1 : "None"}
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <MonthYearPicker
          label="Month-Year Picker"
          value={selectedMonthYear}
          onChange={setSelectedMonthYear}
          placeholder="Select month and year"
          variant="underline"
          color="#0f2854"
          restrictionStartDate="2023-01-01"
          restrictionEndDate="2024-12-31"
        />
        <p>Selected Month-Year: {selectedMonthYear || "None"}</p>
      </div>
    </div>
  );
};
