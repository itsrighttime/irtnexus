"use client";

import { useNavigate } from "react-router-dom";

type HandleNavigate = (
  event: React.MouseEvent<HTMLElement>,
  to: string,
) => void;

/**
 * useSmartNavigate Hook
 *
 * Provides unified navigation for internal routes and external URLs.
 * Supports Ctrl/Cmd + click and middle-click for opening in a new tab.
 */
export const useSmartNavigate = (): HandleNavigate => {
  const navigate = useNavigate();

  const handleNavigate: HandleNavigate = (event, to) => {
    if (!to) return;

    // Detect modifier keys or middle-click
    const openInNewTab = event.ctrlKey || event.metaKey || event.button === 1;

    // Determine if target is external
    const isExternal = /^https?:\/\//i.test(to);

    if (isExternal) {
      // External link
      if (openInNewTab) {
        window.open(to, "_blank");
      } else {
        window.location.href = to;
      }
    } else {
      // Internal route
      if (openInNewTab) {
        window.open(`${window.location.origin}${to}`, "_blank");
      } else {
        navigate(to);
      }
    }
  };

  return handleNavigate;
};
