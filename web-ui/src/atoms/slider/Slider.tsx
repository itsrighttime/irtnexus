"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Slider.module.css";
import { Icons } from "@/assets/icons";
import { Button } from "../button/Button";

const { minusIcon, plusIcon } = Icons;

export type SliderValueSide = "none" | "left" | "right" | "top" | "bottom";

interface SliderProps {
  value?: number;
  setResult: (val: number) => void;
  color?: string;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showRange?: boolean;
  showValueSide?: SliderValueSide;
  precision?: number;
  width?: string;
  required?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  value = 0,
  setResult,
  color,
  min = 0,
  max = 100,
  step = 1,
  label = "",
  showRange = true,
  showValueSide = "none",
  precision = 10,
  width = "300px",
  required = false,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(value || 0);
  const sliderRef = useRef<HTMLInputElement | null>(null);

  // Sync value prop if it changes
  useEffect(() => {
    if (value !== 0 && sliderValue === 0) setSliderValue(value || 0);
  }, [value]);

  // Update slider background dynamically
  useEffect(() => {
    const updateSliderBackground = (val: number) => {
      const percentage = ((val - min) / (max - min)) * 100;
      if (sliderRef.current) {
        sliderRef.current.style.background = `linear-gradient(to right, ${
          color || "var(--color-primary)"
        } ${percentage}%, var(--color-border) ${percentage}%)`;
      }
    };

    updateSliderBackground(sliderValue);
  }, [sliderValue, color, min, max]);

  const roundToPrecision = (val: number) => {
    return Math.round(val * precision) / precision;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue)) {
      const rounded = roundToPrecision(newValue);
      setSliderValue(rounded);
      setResult(rounded);
    }
  };

  const handlePlus = () => {
    setSliderValue((prev) => {
      const next = prev + step;
      return next < max ? roundToPrecision(next) : max;
    });
  };

  const handleMinus = () => {
    setSliderValue((prev) => {
      const next = prev - step;
      return next > min ? roundToPrecision(next) : min;
    });
  };

  const cssVariable: React.CSSProperties = {
    "--color": color ? color : "var(--colorCyan)",
    "--width": width,
  } as React.CSSProperties;

  return (
    <div className={styles.sliderContainer} style={cssVariable}>
      {label && <label className={styles.sliderLabel}>{label}</label>}
      <div
        className={`${styles.inputOutputContainer} ${
          showValueSide === "left"
            ? styles.left
            : showValueSide === "right"
              ? styles.right
              : showValueSide === "top"
                ? styles.top
                : styles.bottom
        }`}
      >
        <div className={styles.inputContainer}>
          <Button
            iconLeft={minusIcon}
            onClick={handleMinus}
            color={color}
            style={{ border: "none", borderRadius: "50%" }}
            iconOnly
            variant="ghost"
          />
          {showRange && <p>{min}</p>}
          <input
            ref={sliderRef}
            type="range"
            value={sliderValue}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            className={styles.slider}
          />
          {showRange && <p>{max}</p>}
          <Button
            iconLeft={plusIcon}
            onClick={handlePlus}
            color={color}
            style={{ border: "none", borderRadius: "50%" }}
            iconOnly
            variant="ghost"
          />
          {required && <p className={styles.required}>*</p>}
        </div>
        {showValueSide !== "none" && (
          <div className={styles.sliderValue}>{sliderValue}</div>
        )}
      </div>
    </div>
  );
};
