"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

export const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
): void => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const listener = (event: MouseEvent) => {
      const el = ref.current;

      if (!el || el.contains(event.target as Node)) return;

      handler();
    };

    document.addEventListener("mousedown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
};
