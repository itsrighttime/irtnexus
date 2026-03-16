"use client";
import { useEffect, useRef, useState } from "react";
/**
 * useUserActiveOnTab Hook
 *
 * Custom React hook that tracks user activity on the current browser tab
 * and marks the user as inactive after a specified period of inactivity.
 *
 * @param timeout - Inactivity timeout in minutes (default 5)
 * @returns isActive - Boolean indicating whether the user is currently active on the tab
 */
export const useUserActiveOnTab = (timeout = 5) => {
    const [isActive, setIsActive] = useState(true);
    // Use a ref with type NodeJS.Timeout | number | null
    const timeoutId = useRef(null);
    const resetTimer = () => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        setIsActive(true);
        timeoutId.current = setTimeout(() => setIsActive(false), timeout * 60 * 1000);
    };
    useEffect(() => {
        // Guard: Only run in browser environment
        if (typeof window === "undefined" || typeof document === "undefined") {
            return;
        }
        const events = [
            "mousemove",
            "mousedown",
            "keydown",
            "touchstart",
            "scroll",
            "visibilitychange",
        ];
        const handleActivity = () => {
            if (document.visibilityState === "visible") {
                resetTimer();
            }
        };
        events.forEach((event) => window.addEventListener(event, handleActivity));
        resetTimer();
        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            events.forEach((event) => window.removeEventListener(event, handleActivity));
        };
    }, [timeout]);
    return isActive;
};
