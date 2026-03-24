"use client";

import type { AlertItem, AlertType } from "@/atoms/alert/alert.type";
import { useState, useCallback } from "react";

interface UseAlertsReturn {
  alertContainer: AlertItem[];
  addAlert: (message: string, type: AlertType) => void;
  removeAlert: (id: string) => void;
}

/**
 * useAlerts Hook
 *
 * Custom React hook for managing a queue-based alert system.
 */
export const useAlerts = (): UseAlertsReturn => {
  const [alertContainer, setAlertContainer] = useState<AlertItem[]>([]);

  const addAlert = useCallback((message: string, type: AlertType) => {
    const uniqueId =
      Date.now().toString() + Math.random().toString(36).substring(2, 9);

    setAlertContainer((prevAlerts) => [
      ...prevAlerts,
      {
        id: uniqueId,
        message,
        type,
      },
    ]);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlertContainer((prevAlerts) =>
      prevAlerts.filter((alert) => alert.id !== id),
    );
  }, []);

  return {
    alertContainer,
    addAlert,
    removeAlert,
  };
};
