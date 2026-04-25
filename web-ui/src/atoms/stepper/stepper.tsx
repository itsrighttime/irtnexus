"use client";

import { useState, useEffect, type CSSProperties } from "react";
import styles from "./Stepper.module.css"; // Ensure this CSS exists
import { Icons } from "@/assets/icons";
import { Button } from "../button/Button";

const { minusIcon, plusIcon } = Icons;

export interface StepperProps {
  value?: number;
  setResult: (val: number) => void;
  color?: string;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  width?: string;
  required?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  value = 0,
  setResult,
  color = "var(--color-primary)",
  min = 0,
  max = 100,
  step = 5,
  label = "",
  width = "300px",
  required = false,
}) => {
  const [stepperValue, setStepperValue] = useState<number>(value || 0);

  // Sync external value prop
  useEffect(() => {
    if (value !== 0 && stepperValue === 0) setStepperValue(value || 0);
  }, [value]);

  const handleIncrement = () => {
    if (stepperValue + step <= max) {
      const newValue = stepperValue + step;
      setStepperValue(newValue);
      setResult(newValue);
    }
  };

  const handleDecrement = () => {
    if (stepperValue - step >= min) {
      const newValue = stepperValue - step;
      setStepperValue(newValue);
      setResult(newValue);
    }
  };

  const cssVariable: CSSProperties = {
    "--color": color,
    "--width": width,
  } as CSSProperties;

  return (
    <div className={styles.stepperContainer} style={cssVariable}>
      <div className={styles.header}>
        {label && <label className={styles.stepperLabel}>{label}</label>}
        {required && <p className={styles.required}>*</p>}
      </div>
      <div className={styles.stepperControls}>
        <Button
          iconLeft={minusIcon}
          onClick={handleDecrement}
          color={"var(--color)"}
          //   style={{ backgroundColor: color }}
          iconOnly
          variant="secondary"
          type="button"
        />
        <div className={styles.stepperOutput}>{stepperValue}</div>

        <Button
          iconLeft={plusIcon}
          onClick={handleIncrement}
          color={"var(--color)"}
          //   style={{ backgroundColor: color }}
          iconOnly
          variant="secondary"
          type="button"
        />
      </div>
    </div>
  );
};
