"use client";

import { useEffect, useState } from "react";
import style from "../css/Alert.module.css";
import { Icons } from "@/assets";
import { Button } from "../button/Button";

const { crossIcon } = Icons;

type AlertType = "success" | "error" | "info" | "warning";

interface AlertProps {
  /** The text message to display inside the alert */
  message: string;
  /** The type of alert, which determines styling */
  type: AlertType;
  /** Callback function called when the alert is dismissed */
  onDismiss: () => void;
}

/**
 * Alert component to display a dismissible notification with an auto-fade timer.
 */
export const Alert: React.FC<AlertProps> = ({ message, type, onDismiss }) => {
  const TIME_LIMIT = 10;

  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);
  const [width, setWidth] = useState<number>(100);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsVisible(false); // Trigger fade-out
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Update progress bar width
  useEffect(() => {
    setWidth((timeLeft / TIME_LIMIT) * 100);
  }, [timeLeft]);

  // Delay unmount after fade-out animation
  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => onDismiss(), 400); // Match CSS transition
      return () => clearTimeout(timeout);
    }
  }, [isVisible, onDismiss]);

  const handleManualDismiss = () => setIsVisible(false);

  return (
    <div
      className={`${style.alert} ${style[type]} ${!isVisible ? style.fadeOut : ""}`}
    >
      {message}
      <div className={style.statusBar} style={{ width: `${width}%` }}></div>
      <div className={style.crossIcon}>
        <Button
          iconOnly
          iconLeft={crossIcon}
          onClick={handleManualDismiss}
          color="#fff"
          style={{ borderRadius: "50%", backgroundColor: "#ff5969" }}
        />
      </div>
    </div>
  );
};
