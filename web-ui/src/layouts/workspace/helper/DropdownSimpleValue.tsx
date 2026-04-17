"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "../css/DropdownSimpleValue.module.css";
import { Tab } from "./Tab.js";
import type { TabItem } from "./types.js";

interface DropdownPosition {
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
}

interface DropdownSimpleValueProps {
  items: TabItem[];
  onSelect: () => void;
}

export const DropdownSimpleValue: React.FC<DropdownSimpleValueProps> = ({
  items,
  onSelect,
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<DropdownPosition>({
    vertical: "bottom",
    horizontal: "right",
  });

  useEffect(() => {
    const checkPosition = () => {
      const el = dropdownRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const dropdownWidth = el.offsetWidth;
      const dropdownHeight = el.offsetHeight;

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = viewportWidth - rect.right;
      const spaceLeft = rect.left;

      const willOverflowBottom = spaceBelow < dropdownHeight;
      const canFlipTop = spaceAbove >= dropdownHeight;
      const willOverflowRight = spaceRight < dropdownWidth;
      const canAlignLeft = spaceLeft >= dropdownWidth;

      setPosition({
        vertical: willOverflowBottom && canFlipTop ? "top" : "bottom",
        horizontal: willOverflowRight && canAlignLeft ? "left" : "right",
      });
    };

    checkPosition();
    window.addEventListener("resize", checkPosition);
    return () => window.removeEventListener("resize", checkPosition);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`${styles.dropdownMenu} ${
        position.vertical === "top" ? styles.dropTop : styles.dropBottom
      } ${
        position.horizontal === "left" ? styles.alignLeft : styles.alignRight
      }`}
    >
      {items.map((tab) => (
        <Tab
          key={tab.key}
          mykey={tab.key}
          value={tab.value}
          icon={tab.icon as any}
          onClick={(value: string) => {
            onSelect();
            tab.onClick?.(value);
          }}
          color={tab.color}
          dropdown={tab.dropdown}
        />
      ))}
    </div>
  );
};
