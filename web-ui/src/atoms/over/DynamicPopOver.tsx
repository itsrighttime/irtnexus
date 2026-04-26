"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

type Placement = "top" | "bottom";

type DynamicPopoverProps = {
  anchorRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose: () => void;
  children: (args: { placement: Placement }) => ReactNode;
  offset?: number;
};

export const DynamicPopover = ({
  anchorRef,
  isOpen,
  onClose,
  children,
  offset = 0,
}: DynamicPopoverProps) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const [placement, setPlacement] = useState<Placement>("bottom");

  const updatePosition = () => {
    if (!anchorRef.current || !popoverRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    const popoverHeight = popoverRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top = rect.bottom + offset;
    let finalPlacement: Placement = "bottom";

    // Flip logic
    if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
      top = rect.top - popoverHeight - offset;
      finalPlacement = "top";
    }

    setPlacement(finalPlacement);

    setPosition({
      top,
      left: rect.left,
      width: rect.width,
    });
  };

  // Run after render (important for height)
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(updatePosition);
    }
  }, [isOpen]);

  // Scroll + resize
  useEffect(() => {
    if (!isOpen) return;

    const handler = () => requestAnimationFrame(updatePosition);

    window.addEventListener("scroll", handler);
    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [isOpen]);

  // Outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, onClose]);

  // Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: position.width,
        zIndex: 9999,
      }}
    >
      {children({ placement })}
    </div>,
    document.body,
  );
};
