"use client";

import React, { useRef, useEffect } from "react";
import styles from "../css/FullscreenWrapper.module.css";

interface ToggleFullscreenArg {
  toggleFullscreen: () => void;
}

interface FullscreenWrapperProps {
  children: React.ReactNode | ((arg: ToggleFullscreenArg) => React.ReactNode);
  shortcutKey?: string;
}

export const FullscreenWrapper: React.FC<FullscreenWrapperProps> = ({
  children,
  shortcutKey = "`",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const enterFullScreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if ((el as HTMLDivElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen)
      (el as HTMLDivElement & { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
    else if ((el as HTMLDivElement & { msRequestFullscreen?: () => void }).msRequestFullscreen)
      (el as HTMLDivElement & { msRequestFullscreen: () => void }).msRequestFullscreen();
  };

  const exitFullScreen = () => {
    if (typeof document === "undefined") return;
    if (document.exitFullscreen) document.exitFullscreen();
    else if ((document as Document & { webkitExitFullscreen?: () => void }).webkitExitFullscreen)
      (document as Document & { webkitExitFullscreen: () => void }).webkitExitFullscreen();
    else if ((document as Document & { msExitFullscreen?: () => void }).msExitFullscreen)
      (document as Document & { msExitFullscreen: () => void }).msExitFullscreen();
  };

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) enterFullScreen();
    else exitFullScreen();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === shortcutKey) {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className={styles.fullscreenWrapper}>
      {typeof children === "function"
        ? children({ toggleFullscreen })
        : children}
    </div>
  );
};
