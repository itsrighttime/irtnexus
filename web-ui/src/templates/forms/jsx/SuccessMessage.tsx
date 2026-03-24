"use client";

import { Button } from "@/atoms";
import styles from "../css/ShowError.module.css"; // Reuse styles for wrapper and list
import { type MouseEventHandler } from "react";

interface SuccessMessageProps {
  /** The success message to display */
  message?: string;
  /** Optional color for the title and button */
  color?: string;
  /** Callback when "Go to Home" button is clicked */
  onHomeClick?: MouseEventHandler<Element>;
  /** Optional title for the success message */
  title?: string;
}

/**
 * SuccessMessage Component
 *
 * Displays a success notification message with an optional title and
 * a button to redirect the user, typically used after a successful form submission.
 */
export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message = "Form submitted successfully!",
  color = "var(--colorGreen)",
  onHomeClick,
  title = "Success!",
}) => {
  return (
    <div className={styles.errorList}>
      <p className={styles.title} style={{ color }}>
        {title}
      </p>
      <p className={styles.message}>{message}</p>
      <Button color={color} onClick={onHomeClick}>
        Go to Home
      </Button>
    </div>
  );
};
