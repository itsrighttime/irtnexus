"use client";

// components/WorkspaceLayout.tsx
import React from "react";
import { useWorkspaceLayout } from "../helper/useWorkspaceLayout.js";

import { SmallScreenLayout } from "./SmallScreenLayout.js";
import { LargeScreenLayout } from "./LargeScreenLayout.js";
import type { ZoneTabsMap } from "../helper/types.js";
import { useMediaQuery } from "@/hooks/useMediaQuery.js";
import { ErrorPage } from "@/atoms/index.js";

interface WorkspaceLayoutProps {
  api?: string;
  height?: string | number;
  width?: string | number;
  level?: number;
  maxDepth?: number;
  providedTabs?: ZoneTabsMap | null;
  providedContent?: string | null;
  toggleFullscreen?: () => void;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  api = "",
  height = "100%",
  width = "100%",
  level = 1,
  maxDepth = 2,
  providedTabs = null,
  providedContent = null,
  toggleFullscreen = () => {},
}) => {
  const isSmallDevice = useMediaQuery(900);

  const { tabsPrimary, tabsSecondary, content, cssVariable, navigatorSize } =
    useWorkspaceLayout({
      api,
      level,
      maxDepth,
      providedTabs,
      providedContent,
      toggleFullscreen,
    });

  if (!tabsPrimary && !tabsSecondary && !content)
    return <ErrorPage {...({} as any)} />;

  const layoutProps = {
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
  };

  return isSmallDevice ? (
    <SmallScreenLayout {...layoutProps} />
  ) : (
    <LargeScreenLayout {...layoutProps} />
  );
};
