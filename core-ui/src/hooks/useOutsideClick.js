"use client";
import { useEffect } from "react";
export const useOutsideClick = (ref, handler) => {
    useEffect(() => {
        if (typeof document === "undefined")
            return;
        const listener = (event) => {
            const el = ref.current;
            if (!el || el.contains(event.target))
                return;
            handler();
        };
        document.addEventListener("mousedown", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
        };
    }, [ref, handler]);
};
