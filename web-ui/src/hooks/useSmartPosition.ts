"use client";

import { useLayoutEffect, useState } from "react";
import type { RefObject } from "react";

type VerticalPosition = "top" | "bottom";
type HorizontalPosition = "left" | "right";

interface Position {
  vertical: VerticalPosition;
  horizontal: HorizontalPosition;
  ready: boolean; // 👈 NEW
}

export const useSmartPosition = (
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
): Position => {
  const [position, setPosition] = useState<Position>({
    vertical: "bottom",
    horizontal: "right",
    ready: false,
  });

  useLayoutEffect(() => {
    if (!isOpen) return;

    const compute = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const width = el.offsetWidth;
      const height = el.offsetHeight;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const space = {
        below: vh - rect.bottom,
        above: rect.top,
        right: vw - rect.right,
        left: rect.left,
      };

      setPosition({
        vertical:
          space.below < height && space.above > space.below ? "top" : "bottom",
        horizontal:
          space.right < width && space.left > space.right ? "left" : "right",
        ready: true,
      });
    };

    // compute BEFORE paint
    requestAnimationFrame(() => {
      requestAnimationFrame(compute);
    });

    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);

    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [ref, isOpen]);

  return position;
};
