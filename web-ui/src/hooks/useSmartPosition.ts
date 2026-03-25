"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";

type VerticalPosition = "top" | "bottom";
type HorizontalPosition = "left" | "right";

interface Position {
  vertical: VerticalPosition;
  horizontal: HorizontalPosition;
}

/**
 * useSmartPosition Hook
 *
 * Determines the optimal vertical and horizontal position of a DOM element
 * relative to the viewport. Useful for tooltips, popovers, dropdowns, etc.
 *
 * @param ref - Ref pointing to the target DOM element
 * @returns Computed vertical and horizontal positions
 */
export const useSmartPosition = (
  ref: RefObject<HTMLElement> | null | any,
): Position => {
  const [position, setPosition] = useState<Position>({
    vertical: "bottom",
    horizontal: "right",
  });

  useEffect(() => {
    const checkPosition = () => {
      if (!ref) return;
      const el = ref.current;
      if (!el) return;

      const { top, bottom, left, right } = el.getBoundingClientRect();
      const { offsetWidth: width, offsetHeight: height } = el;
      const { innerHeight: vh, innerWidth: vw } = window;

      const space = {
        below: vh - bottom,
        above: top,
        right: vw - right,
        left: left,
      };

      setPosition({
        vertical:
          space.below < height && space.above >= height ? "top" : "bottom",
        horizontal:
          space.right < width && space.left >= width ? "left" : "right",
      });
    };

    checkPosition();
    window.addEventListener("resize", checkPosition);
    return () => window.removeEventListener("resize", checkPosition);
  }, [ref]);

  return position;
};
