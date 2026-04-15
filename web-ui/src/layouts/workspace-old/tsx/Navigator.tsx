"use client";

import React from "react";
import styles from "../css/Navigator.module.css";
import { Tabs } from "../helper/Tabs.js";
import { validateTabsIcons } from "../helper/validateTabsIcons.js";
import { workspaceLayoutKeys } from "../helper/workspaceLayoutKeys.js";
import type { TabsMap } from "../helper/types.js";
import { FlexContainer } from "@/layouts/containers/FlexContainer.js";

const { POSITIONS } = workspaceLayoutKeys;

interface NavigatorProps {
  style?: React.CSSProperties;
  direction?: "row" | "column";
  size?: string;
  tabs?: TabsMap;
}

export const Navigator: React.FC<NavigatorProps> = ({
  style,
  direction = "row",
  size = "35px",
  tabs,
}) => {
  if (!tabs) return <></>;

  validateTabsIcons(tabs, direction);

  const customStyle: React.CSSProperties = {
    height: direction === "column" ? "100%" : size,
    width: direction === "column" ? size : "100%",
    ...style,
  };

  return (
    <FlexContainer
      direction={direction}
      justify="between"
      className={styles.navigator}
      style={customStyle}
    >
      <Tabs direction={direction} tabs={tabs[POSITIONS.start]} />
      <Tabs direction={direction} tabs={tabs[POSITIONS.center]} />
      <Tabs direction={direction} tabs={tabs[POSITIONS.end]} />
    </FlexContainer>
  );
};
