"use client";

import { Icons } from "@/assets/icons/index.js";
import styles from "../css/GenericForm.module.css";
import { FIELDS_PROPS as FPs } from "../validation/helper/fields.js";
import { type MouseEventHandler } from "react";
import { Button } from "@/atoms";

const { arrowLeftIcon, arrowRightIcon, crossIcon } = Icons;

interface FormFooterProps {
  mode: "single" | "multi";
  config: Record<string, any>; // Or a proper typed form config
  currentStep: number;
  color: string;
  submitLabel: string;
  next: MouseEventHandler<Element>;
  back: MouseEventHandler<Element>;
  handleSubmit: MouseEventHandler<Element>;
  clearFormPersistence: MouseEventHandler<Element>;
}

export function FormFooter({
  mode,
  config,
  currentStep,
  color,
  submitLabel,
  next,
  back,
  handleSubmit,
  clearFormPersistence,
}: FormFooterProps) {
  const steps = config[FPs.STEP] as any[]; // cast to array for safety

  return (
    <div className={styles.footer}>
      {mode === "multi" && steps.length > 1 ? (
        <div className={styles.stepButtons}>
          {currentStep > 0 && (
            <Button
              iconLeft={arrowLeftIcon}
              iconOnly
              tooltip="Back"
              onClick={back}
              color={color}
              variant="ghost"
              type="button"
            />
          )}

          <Button
            iconOnly
            iconLeft={crossIcon}
            tooltip="Clear Every Thing"
            onClick={clearFormPersistence}
            variant="ghost"
            color="var(--color-error)"
          />

          {currentStep < steps.length - 1 ? (
            <Button
              iconLeft={arrowRightIcon}
              iconOnly
              tooltip="Next"
              onClick={next}
              variant="ghost"
              color={color}
              type="button"
            />
          ) : (
            <Button onClick={handleSubmit} color={color}>
              {submitLabel}
            </Button>
          )}
        </div>
      ) : (
        <Button onClick={handleSubmit} color={color}>
          {submitLabel}
        </Button>
      )}

      {mode === "multi" && (
        <>
          <div className={styles.progressBarWrapper}>
            <div
              className={styles.progressBar}
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
                backgroundColor: color,
              }}
            />
          </div>
          <div className={styles.progressStatus}>
            Step {currentStep + 1} of {steps.length}
          </div>
        </>
      )}
    </div>
  );
}
