"use client";
import { useState, useCallback } from "react";
/**
 * useAlerts Hook
 *
 * Custom React hook for managing a queue-based alert system.
 */
export const useAlerts = () => {
    const [alertContainer, setAlertContainer] = useState([]);
    const addAlert = useCallback((message, type) => {
        const uniqueId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
        setAlertContainer((prevAlerts) => [
            ...prevAlerts,
            {
                id: uniqueId,
                message,
                type,
            },
        ]);
    }, []);
    const removeAlert = useCallback((id) => {
        setAlertContainer((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, []);
    return {
        alertContainer,
        addAlert,
        removeAlert,
    };
};
