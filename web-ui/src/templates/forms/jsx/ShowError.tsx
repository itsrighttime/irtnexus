"use client";

import { Button } from "@/atoms";
import { Icons } from "@/assets";
import styles from "../css/ShowError.module.css";

const { crossIcon } = Icons;

interface ErrorItem {
  label?: string;
  name?: string;
  error?: string;
}

interface ErrorListProps {
  /** Object of form field errors */
  errors?: Record<string, ErrorItem>;
  /** Optional primary color for buttons */
  color?: string;
  /** Callback when user chooses to retry updating the form */
  onClick: () => void;
  /** Callback to clear persisted form data */
  clearFormPersistence: () => void;
}

/**
 * ErrorList Component
 *
 * Displays a structured list of form validation errors along with actions
 * to clear or update the form.
 */
export const ErrorList: React.FC<ErrorListProps> = ({
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
        <Button
          iconOnly
          iconLeft={crossIcon}
          tooltip="Clear Every Thing"
          onClick={() => {
            clearFormPersistence();
            onClick();
          }}
          color="var(--color-error)"
        />
        <Button color={color} onClick={onClick}>
          Let's Update
        </Button>
      </div>
    </div>
  );
};
