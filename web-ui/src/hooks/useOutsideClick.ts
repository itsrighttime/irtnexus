"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

type MaybeArray<T> = T | T[];

export const useOutsideClick = (
  refs: MaybeArray<RefObject<HTMLElement | null>>,
  handler: () => void,
): void => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const refArray = Array.isArray(refs) ? refs : [refs];

    const listener = (event: MouseEvent) => {
      const target = event.target as Node;

      const isInside = refArray.some(
        (ref) => ref.current && ref.current.contains(target),
      );

      if (isInside) return;

      handler();
    };

    document.addEventListener("mousedown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [refs, handler]);
};

/*

useOutsideClick(popoverRef, onClose);
useOutsideClick([popoverRef, anchorRef], onClose);

*/
