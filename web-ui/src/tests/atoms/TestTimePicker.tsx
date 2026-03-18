"use client";

import { TimePicker } from "@/atoms";
import { useState } from "react";

export const TestTimePicker: React.FC = () => {
  const [time, setTime] = useState<string>("10:15 AM");

  const [minTime, setMinTime] = useState<string>("09:00 AM");
  const [maxTime, setMaxTime] = useState<string>("06:00 PM");

  const [minuteStep, setMinuteStep] = useState<number>(15);
  const [hourStep, setHourStep] = useState<number>(1);

  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [radius, setRadius] = useState<"none" | "sm" | "md" | "lg">("md");
  const [disabled, setDisabled] = useState<boolean>(false);

  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "420px",
      }}
    >
      <h2>⏱ TimePicker Playground</h2>

      {/* 🔥 TimePicker */}
      <TimePicker
        label="Select Time"
        value={time}
        setResult={setTime}
        minTime={minTime}
        maxTime={maxTime}
        minuteStep={minuteStep}
        hourStep={hourStep}
        size={size}
        radius={radius}
        disabled={disabled}
        required
      />

      {/* Result */}
      <div>
        <strong>Selected Time:</strong> {time}
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Min Time */}
        <label>
          Min Time:
          <input
            type="text"
            value={minTime}
            onChange={(e) => setMinTime(e.target.value)}
            placeholder="09:00 AM"
          />
        </label>

        {/* Max Time */}
        <label>
          Max Time:
          <input
            type="text"
            value={maxTime}
            onChange={(e) => setMaxTime(e.target.value)}
            placeholder="06:00 PM"
          />
        </label>

        {/* Minute Step */}
        <label>
          Minute Step:
          <select
            value={minuteStep}
            onChange={(e) => setMinuteStep(Number(e.target.value))}
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
          </select>
        </label>

        {/* Hour Step */}
        <label>
          Hour Step:
          <select
            value={hourStep}
            onChange={(e) => setHourStep(Number(e.target.value))}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </label>

        {/* Size */}
        <label>
          Size:
          <select
            value={size}
            onChange={(e) =>
              setSize(e.target.value as "small" | "medium" | "large")
            }
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>

        {/* Radius */}
        <label>
          Radius:
          <select
            value={radius}
            onChange={(e) =>
              setRadius(e.target.value as "none" | "sm" | "md" | "lg")
            }
          >
            <option value="none">None</option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>

        {/* Disabled */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
          />
          Disabled
        </label>
      </div>
    </div>
  );
};
