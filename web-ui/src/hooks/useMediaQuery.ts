"use client";

import { useState, useEffect } from "react";

export const useMediaQuery = (breakpoint: number = 900): boolean => {
  const getMatches = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= breakpoint;
  };

  const [isSmallDevice, setIsSmallDevice] = useState<boolean>(getMatches);

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
