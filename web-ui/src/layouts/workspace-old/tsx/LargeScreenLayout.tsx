"use client";

import React from "react";
import styles from "./../css/WorkspaceLayout.module.css";
import { Navigator } from "./Navigator.js";
import { WorkspaceLayout } from "./WorkspaceLayout.js";
import { workspaceLayoutKeys } from "../helper/workspaceLayoutKeys.js";
import type { ZoneTabsMap } from "../helper/types.js";

const { ZONES } = workspaceLayoutKeys;

interface LargeScreenLayoutProps {
  height?: string | number;
  width?: string | number;
  cssVariable?: React.CSSProperties & Record<string, string>;
  navigatorSize?: string;
  tabsPrimary?: ZoneTabsMap | null;
  tabsSecondary?: ZoneTabsMap | null;
  content?: string | null;
  api?: string;
  level: number;
  maxDepth: number;
  toggleFullscreen?: () => void;
}

export const LargeScreenLayout: React.FC<LargeScreenLayoutProps> = ({
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
}) => (
  <div
    className={styles.workspaceLayout}
    style={{ height, width, ...cssVariable }}
  >
    {tabsPrimary?.[ZONES.commandBar] && (
      <div className={styles.top}>
        <Navigator size={navigatorSize} tabs={tabsPrimary[ZONES.commandBar]} />
      </div>
    )}

    <div className={styles.midOfTopBottom}>
      {tabsPrimary?.[ZONES.sidebar] && (
        <div className={styles.left}>
          <Navigator
            direction="column"
            size={navigatorSize}
            tabs={tabsPrimary[ZONES.sidebar]}
          />
        </div>
      )}

      <div className={styles.midOfLeftRight}>
        {/* {level < maxDepth && tabsSecondary ? (
          <WorkspaceLayout
            api={api}
            level={level + 1}
            maxDepth={maxDepth}
            providedTabs={tabsSecondary}
            providedContent={content}
            toggleFullscreen={toggleFullscreen}
          />
        ) : (
          <div>{JSON.stringify(content)}</div>
        )} */}
      </div>

      {tabsPrimary?.[ZONES.tools] && (
        <div className={styles.right}>
          <Navigator
            direction="column"
            size={navigatorSize}
            tabs={tabsPrimary[ZONES.tools]}
          />
        </div>
      )}
    </div>

    {tabsPrimary?.[ZONES.statusBar] && (
      <div className={styles.bottom}>
        <Navigator size={navigatorSize} tabs={tabsPrimary[ZONES.statusBar]} />
      </div>
    )}
  </div>
);
