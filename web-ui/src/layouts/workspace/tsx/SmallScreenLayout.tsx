"use client";

import React from "react";
import { workspaceLayoutKeys } from "../helper/workspaceLayoutKeys.js";
import type { ZoneTabsMap } from "../helper/types.js";

const { ZONES } = workspaceLayoutKeys;

interface SmallScreenLayoutProps {
  height?: string | number;
  width?: string | number;
  cssVariable?: React.CSSProperties;
  navigatorSize?: string;
  tabsPrimary?: ZoneTabsMap | null;
  tabsSecondary?: ZoneTabsMap | null;
  content?: string | null;
  api?: string;
  level?: number;
  maxDepth?: number;
  toggleFullscreen?: () => void;
}

export const SmallScreenLayout: React.FC<SmallScreenLayoutProps> = ({
  height,
  width,
  cssVariable,
  navigatorSize,
  tabsPrimary,
  tabsSecondary,
  content,
  api,
  level,
  maxDepth,
  toggleFullscreen,
}) => <div> Implementattion is pending </div>;
