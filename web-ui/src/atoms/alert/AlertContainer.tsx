"use client";

import { Alert } from "./Alert";
import style from "./Alert.module.css";
import type { AlertContainerProps } from "./alert.type";

/**
 * AlertContainer component to render a list of Alert components.
 */
export const AlertContainer: React.FC<AlertContainerProps> = ({
  alertContainer,
  removeAlert,
}) => {
  return (
    <div className={style.alertContainer}>
      {alertContainer.map((alert, index) => (
        <Alert
          key={`${index}-${alert.id}`}
          message={alert.message}
          type={alert.type}
          onDismiss={() => removeAlert(alert.id)}
          // TypeScript requires style to be part of Alert's props if used
          // style={{ top: `${index * 60}px` }}
        />
      ))}
    </div>
  );
};
