"use client";

import { Button } from "../../../InputFields/Actions/jsx/Button.jsx";
import { IconButton } from "../../../InputFields/Actions/jsx/IconButton.jsx";
import {
  arrowLeftIcon,
  arrowRightIcon,
  crossIcon,
} from "../../../utils/icons.jsx";
import styles from "../css/GenericForm.module.css";
import { FIELDS_PROPS as FPs } from "../validation/helper/fields.js";

/**
 * FormFooter Component
 *
 * Renders the footer for a form, supporting both single-step and multi-step modes.
 *
 * Props:
 * @param {"single"|"multi"} mode - Determines whether the form is single-step or multi-step.
 * @param {Object} config - Form configuration object, including steps and fields.
 * @param {number} currentStep - Current active step index (for multi-step forms).
 * @param {string} color - Primary color for buttons and progress indicators.
 * @param {string} submitLabel - Label for the submit button.
 * @param {Function} next - Callback to move to the next step.
 * @param {Function} back - Callback to move to the previous step.
 * @param {Function} handleSubmit - Callback to submit the form.
 * @param {Function} clearFormPersistence - Callback to clear all form data (reset form).
 *
 * Behavior:
 * - In multi-step mode, displays "Back", "Next", and "Clear Everything" buttons.
 * - Shows a progress bar indicating the current step in multi-step forms.
 * - In single-step mode, only the submit button is displayed.
 */
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
}) {
  return (
    <div className={styles.footer}>
      {mode === "multi" && config[FPs.STEP].length > 1 ? (
        <div className={styles.stepButtons}>
          {currentStep > 0 && (
            <IconButton
              icon={arrowLeftIcon}
              label="Back"
              onClick={back}
              size="2"
              color={color}
            />
          )}

          <IconButton
            icon={crossIcon}
            label="Clear Every Thing"
            onClick={clearFormPersistence}
            size="2"
            color={"var(--colorRed)"}
          />

          {currentStep < config[FPs.STEP].length - 1 ? (
            <IconButton
              icon={arrowRightIcon}
              label="Next"
              onClick={next}
              size="2"
              color={color}
            />
          ) : (
            <Button text={submitLabel} onClick={handleSubmit} color={color} />
          )}
        </div>
      ) : (
        <Button text={submitLabel} onClick={handleSubmit} color={color} />
      )}

      {mode === "multi" && (
        <>
          <div className={styles.progressBarWrapper}>
            <div
              className={styles.progressBar}
              style={{
                width: `${
                  ((currentStep + 1) / config[FPs.STEP].length) * 100
                }%`,
                backgroundColor: color,
              }}
            />
          </div>
          <div className={styles.progressStatus}>
            Step {currentStep + 1} of {config[FPs.STEP].length}
          </div>
        </>
      )}
    </div>
  );
}
