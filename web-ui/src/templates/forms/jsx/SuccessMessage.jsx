"use client";

import { Button } from "../../../InputFields/Actions/jsx/Button.jsx";
import styles from "../css/ShowError.module.css"; // Reuse styles for wrapper and list

/**
 * SuccessMessage Component
 *
 * Displays a success notification message with an optional title and
 * a button to redirect the user, typically used after a successful form submission.
 *
 * Props:
 * @param {string} message - The success message to display (default: "Form submitted successfully!").
 * @param {string} color - Optional color for the title and button (default: "var(--colorGreen)").
 * @param {Function} onHomeClick - Callback function fired when the "Go to Home" button is clicked.
 * @param {string} title - Optional title for the success message (default: "Success!").
 *
 * Behavior:
 * - Displays a title styled with the provided color.
 * - Shows the provided success message below the title.
 * - Provides a button that triggers the onHomeClick callback.
 */
export const SuccessMessage = ({
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
      <Button color={color} text="Go to Home" onClick={onHomeClick} />
    </div>
  );
};
