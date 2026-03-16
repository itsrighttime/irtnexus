"use client";
import { useState, useEffect } from "react";
export const useMediaQuery = (breakpoint = 900) => {
    const getMatches = () => {
        if (typeof window === "undefined")
            return false;
        return window.innerWidth <= breakpoint;
    };
    const [isSmallDevice, setIsSmallDevice] = useState(getMatches);
    useEffect(() => {
        const handleResize = () => {
            setIsSmallDevice(getMatches());
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [breakpoint]);
    return isSmallDevice;
};
