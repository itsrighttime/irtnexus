"use client";

import { useSmartPosition } from "@/hooks";
import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import { Popover } from "../over/Popover";

type TooltipProps = {
  children: ReactNode;
  content: ReactNode;
  color?: string;
  backgroundColor?: string;
  width?: string;
  delay?: number;
};

export const Tooltip = ({
  children,
  content,
  color = "var(--color-text-light)",
  backgroundColor = "var(--color-gray2)",
  width = "300px",
  delay = 1500,
}: TooltipProps) => {
  const anchorRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const position = useSmartPosition(tooltipRef, isOpen);

  // ---- Handlers ----
  const openWithDelay = () => {
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, delay);
  };

  const close = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsOpen(false);
  };

  // cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // ---- Clone child to attach events ----
  const trigger = isValidElement(children)
    ? cloneElement(children as any, {
        ref: anchorRef,
        onMouseEnter: openWithDelay,
        onMouseLeave: close,
        onFocus: () => setIsOpen(true),
        onBlur: close,
      })
    : children;

  return (
    <>
      {trigger}

      {content && (
        <Popover
          anchorRef={anchorRef}
          isOpen={isOpen}
          onClose={close}
          offset={0}
        >
          <div
            ref={tooltipRef}
            style={{
              position: "absolute",
              maxWidth: width,
              color,
              backgroundColor,
              padding: "1px 10px",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--font-size-xs)",
              textWrap: "nowrap",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              pointerEvents: "none",
              transform: `
              translateY(${position.vertical === "top" ? "-100%" : "0"})
              translateX(${position.horizontal === "left" ? "-100%" : "0"})
            `,
              marginTop: position.vertical === "bottom" ? "6px" : "-6px",
              marginLeft: position.horizontal === "right" ? "6px" : "-6px",
              opacity: position.ready ? 1 : 0,
              border: "1px solid var(--color-gray3)",
            }}
          >
            {content}
          </div>
        </Popover>
      )}
    </>
  );
};
