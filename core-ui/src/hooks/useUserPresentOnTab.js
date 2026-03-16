"use client";
import { useEffect } from "react";
/**
 * useUserPresentOnTab Hook
 *
 * Tracks when the user switches browser tabs or windows.
 */
export const useUserPresentOnTab = ({ onFocus, onBlur, }) => {
    useEffect(() => {
        if (typeof window === "undefined" || typeof document === "undefined") {
            return;
        }
        const handleVisibilityChange = () => {
            if (document.hidden) {
                onBlur?.("TAB_HIDDEN");
            }
            else {
                onFocus?.("TAB_VISIBLE");
            }
        };
        const handleWindowBlur = () => {
            onBlur?.("WINDOW_BLUR");
        };
        const handleWindowFocus = () => {
            onFocus?.("WINDOW_FOCUS");
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleWindowBlur);
        window.addEventListener("focus", handleWindowFocus);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleWindowBlur);
            window.removeEventListener("focus", handleWindowFocus);
        };
    }, [onFocus, onBlur]);
};
