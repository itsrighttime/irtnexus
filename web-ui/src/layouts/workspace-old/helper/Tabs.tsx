"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import styles from "../css/Navigator.module.css";
import { Tab } from "./Tab.js";
import type { TabItem } from "./types.js";
import { useOutsideClick } from "@/hooks/useOutsideClick.js";
import { FlexContainer } from "@/layouts/workspace-old/containers/index.js";

interface TabsProps {
  tabs?: TabItem[];
  direction?: "row" | "column";
}

export const Tabs: React.FC<TabsProps> = ({ tabs = [], direction = "row" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleTabs, setVisibleTabs] = useState<TabItem[]>(tabs);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [overflowTabs, setOverflowTabs] = useState<TabItem[]>([]);

  useOutsideClick(containerRef, () => setIsDropdownOpen(false));

  const calculateTabs = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerSize =
      direction === "row" ? container.offsetWidth : container.offsetHeight;

    let usedSize = 0;
    const newVisible: TabItem[] = [];
    const newOverflow: TabItem[] = [];

    tabs.forEach((tab, index) => {
      const el = itemRefs.current[index];
      if (!el) return;

      const itemSize = direction === "row" ? el.offsetWidth : el.offsetHeight;

      if (usedSize + itemSize < containerSize - 80) {
        usedSize += itemSize;
        newVisible.push(tab);
      } else {
        newOverflow.push(tab);
      }
    });

    setVisibleTabs(newVisible);
    setOverflowTabs(newOverflow);
  };

  useLayoutEffect(() => {
    calculateTabs();

    const handleResize = () => {
      setTimeout(() => {
        calculateTabs();
      }, 0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [tabs, direction]);

  return (
    <FlexContainer
      flexRef={containerRef}
      direction={direction}
      justify="center"
      align="center"
      className={styles.navigatorSection}
    >
      {visibleTabs.map((tab, i) => (
        <Tab
          tabRef={(el: HTMLDivElement | null) => {
            itemRefs.current[i] = el;
          }}
          key={tab.key}
          mykey={tab.key}
          value={tab.value}
          icon={tab.icon as any}
          onClick={tab.onClick}
          color={tab.color}
          dropdown={tab.dropdown}
          extra={tab?.extra}
        />
      ))}
    </FlexContainer>
  );
};
