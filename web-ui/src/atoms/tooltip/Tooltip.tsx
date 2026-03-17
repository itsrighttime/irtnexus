"use client";

import { useState, useRef, useEffect } from "react";
import type { CSSProperties, MouseEvent } from "react";
import ReactDOM from "react-dom";
import styles from "./Tooltip.module.css";
import type { TooltipProps } from "./Tooltip.types";

const OFFSET = 15;

/**
 * Tooltip Component
 *
 * A cursor-following, portal-based tooltip component that displays
 * contextual content on hover with configurable delay, positioning,
 * and styling.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  color = "#272626",
  backgroundColor = "#eceaea",
  width = "250px",
  delay = 1500,
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({});
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only mount on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  const updateTooltipPosition = (x: number, y: number) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const { innerWidth: winW, innerHeight: winH } = window;
    const rect = tooltip.getBoundingClientRect();

    let top = y + OFFSET;
    let left = x;
    let newPosition: "top" | "bottom" = "bottom";

    if (y + OFFSET + rect.height > winH) {
      if (y - OFFSET - rect.height > 0) {
        top = y - OFFSET - rect.height;
        newPosition = "top";
      } else {
        top = Math.max(winH - rect.height - 5, 5);
      }
    }

    left = x - rect.width / 2;
    if (left + rect.width > winW) {
      left = winW - rect.width - 5;
    } else if (left < 0) {
      left = 5;
    }

    setStyle({
      position: "fixed",
      top,
      left,
      zIndex: 9999,
      pointerEvents: "none",
      color,
      backgroundColor,
      "--width": width,
    } as CSSProperties);

    setPosition(newPosition);
  };

  const handleMouseMove = (e: MouseEvent<HTMLSpanElement>) => {
    const { clientX, clientY } = e;
    requestAnimationFrame(() => updateTooltipPosition(clientX, clientY));
  };

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{ display: "inline-block" }}
      >
        {children}
      </span>

      {mounted &&
        ReactDOM.createPortal(
          <div
            ref={tooltipRef}
            style={{
              ...style,
              opacity: visible ? 1 : 0,
              visibility: visible && content ? "visible" : "hidden",
              transition: "opacity 0.15s ease, visibility 0.15s ease",
            }}
            className={`${styles.tooltip} ${styles[position]}`}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};
