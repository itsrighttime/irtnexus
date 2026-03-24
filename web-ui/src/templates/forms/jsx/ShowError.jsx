"use client";

import { Button } from "../../../InputFields/Actions/jsx/Button.jsx";
import { IconButton } from "../../../InputFields/Actions/jsx/IconButton.jsx";
import { crossIcon } from "../../../utils/icons.jsx";
import styles from "../css/ShowError.module.css";

/**
 * ErrorList Component
 *
 * Displays a structured list of form validation errors in a tabular format
 * along with actions to clear or update the form.
 *
 * Props:
 * @param {Object} errors - An object containing form field errors.
 *                          Each key represents a field and value contains
 *                          error details (label, name, error message).
 * @param {string} color - Optional primary color for buttons (default: "var(--colorRed)").
 * @param {Function} onClick - Callback fired when the user chooses to reattempt form update.
 * @param {Function} clearFormPersistence - Callback to clear the persisted form data.
 *
 * Behavior:
 * - Converts the errors object into an array for rendering.
 * - Displays each field label and its corresponding error message in a table.
 * - Provides buttons to either clear all form data or allow the user to retry updating the form.
 */
export const ErrorList = ({
  errors = {},
  color = "var(--colorRed)",
  onClick,
  clearFormPersistence,
}) => {
  // Convert error object to array
  const errorData = Object.values(errors).map((err, index) => ({
    id: index + 1,
    label: err.label || err.name || "Unknown Field",
    error: err.error || "No error message provided",
  }));

  return (
    <div className={styles.errorList}>
      <p className={styles.title}>Oops! Some Errors Found</p>
      <p className={styles.message}>
        Oops! It seems you missed some required fields or entered incorrect
        information. Please review the details below, correct them, and try
        again.
      </p>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell} style={{ flex: 2 }}>
            Field Label
          </div>
          <div className={styles.tableCell} style={{ flex: 4 }}>
            Error Message
          </div>
        </div>

        <div className={styles.tableBody}>
          {errorData.map((err) => (
            <div key={err.id} className={styles.tableRow}>
              <div className={styles.tableCell} style={{ flex: 2 }}>
                {err.label}
              </div>
              <div
                className={styles.tableCell}
                style={{ flex: 4, color: "var(--colorRed)" }}
              >
                {err.error}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.buttons}>
        <IconButton
          icon={crossIcon}
          label="Clear Every Thing"
          onClick={() => {
            clearFormPersistence();
            onClick();
          }}
          size="2"
          color={"var(--colorRed)"}
        />
        <Button color={color} text="Let's Update" onClick={onClick} />
      </div>
    </div>
  );
};
