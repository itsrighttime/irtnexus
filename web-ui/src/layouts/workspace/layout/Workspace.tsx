"use client";

import type { BarTabs } from "../bars";
import { TAB_ORIENTATION as TO } from "../const";
import { WORKSPACE_SLOTS as WS } from "../const/layout";
import { Sidebar } from "../sidebars/Sidebar";
import { renderBar } from "./renderBar";
import { validateWorkspaceConfig } from "./validateWorkspaceConfig.helper";
import { useWorkspaceConfig } from "./workspace.hook";
import styles from "./Workspace.module.css";
import { Outlet, useNavigate } from "react-router-dom";

export const Workspace = () => {
  const navigate = useNavigate();
  const workspaceConfig = useWorkspaceConfig();

  const errors = validateWorkspaceConfig(workspaceConfig);

  if (errors.length) {
    console.error("Invalid workspace config:", errors);
    throw Error("Invalid Workspace Config");
  }

  const hasTabs = (bar: BarTabs | undefined) => {
    if (!bar) return false;

    return Object.values(bar).some(
      (value) => Array.isArray(value) && value.length > 0,
    );
  };

  const {
    [WS.TOP_PRIMARY]: topPrimary,
    [WS.TOP_SECONDARY]: topSecondary,
    [WS.BOTTOM_PRIMARY]: bottomPrimary,
    [WS.BOTTOM_SECONDARY]: bottomSecondary,
    [WS.LEFT_PRIMARY]: leftPrimary,
    [WS.LEFT_SECONDARY]: leftSecondary,
    [WS.RIGHT_PRIMARY]: rightPrimary,
    [WS.RIGHT_SECONDARY]: rightSecondary,
    [WS.LEFT_SIDEBAR]: leftSidebar,
    [WS.RIGHT_SIDEBAR]: rightSidebar,
  } = workspaceConfig;

  const has = {
    topPrimary: hasTabs(topPrimary),
    topSecondary: hasTabs(topSecondary),
    bottomPrimary: hasTabs(bottomPrimary),
    bottomSecondary: hasTabs(bottomSecondary),
    leftPrimary: hasTabs(leftPrimary),
    leftSecondary: hasTabs(leftSecondary),
    rightPrimary: hasTabs(rightPrimary),
    rightSecondary: hasTabs(rightSecondary),
    leftSidebar: !!leftSidebar?.length,
    rightSidebar: !!rightSidebar?.length,
  };

  const handleNavigate = (payload: {
    route?: string;
    key?: string | number;
  }): void => {
    const { route } = payload;
    if (!route) return;
    navigate(route);
  };

  return (
    <div className={styles.workspace}>
      {/* TOP PRIMARY */}
      {has.topPrimary && (
        <div className={styles.topPrimary}>
          {renderBar(topPrimary, TO.HORIZONTAL, WS.TOP_PRIMARY, handleNavigate)}
        </div>
      )}

      <div className={styles.primaryVertical}>
        {/* LEFT BARS */}
        {has.leftPrimary && (
          <div className={styles.leftPrimary}>
            {renderBar(
              leftPrimary,
              TO.VERTICAL,
              WS.LEFT_PRIMARY,
              handleNavigate,
            )}
          </div>
        )}

        {has.leftSecondary && (
          <div className={styles.leftSecondary}>
            {renderBar(
              leftSecondary,
              TO.VERTICAL,
              WS.LEFT_SECONDARY,
              handleNavigate,
            )}
          </div>
        )}

        {has.leftSidebar && leftSidebar && (
          <div className={styles.leftSidebar}>
            <Sidebar
              config={leftSidebar}
              position={WS.LEFT_SIDEBAR}
              onAction={handleNavigate}
            />
          </div>
        )}

        {/* CENTER AREA */}
        <div className={styles.secondaryHorizontal}>
          {has.topSecondary && (
            <div className={styles.topSecondary}>
              {renderBar(
                topSecondary,
                TO.HORIZONTAL,
                WS.TOP_SECONDARY,
                handleNavigate,
              )}
            </div>
          )}

          <div className={styles.content}>
            <Outlet />
          </div>

          {has.bottomSecondary && (
            <div className={styles.bottomSecondary}>
              {renderBar(
                bottomSecondary,
                TO.HORIZONTAL,
                WS.BOTTOM_SECONDARY,
                handleNavigate,
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBARS */}
        {has.rightSidebar && rightSidebar && (
          <div className={styles.rightSidebar}>
            <Sidebar
              position={WS.RIGHT_SIDEBAR}
              config={rightSidebar}
              onAction={handleNavigate}
            />
          </div>
        )}

        {has.rightPrimary && (
          <div className={styles.rightPrimary}>
            {renderBar(
              rightPrimary,
              TO.VERTICAL,
              WS.RIGHT_PRIMARY,
              handleNavigate,
            )}
          </div>
        )}

        {has.rightSecondary && (
          <div className={styles.rightSecondary}>
            {renderBar(
              rightSecondary,
              TO.VERTICAL,
              WS.RIGHT_SECONDARY,
              handleNavigate,
            )}
          </div>
        )}
      </div>

      {/* BOTTOM PRIMARY */}
      {has.bottomPrimary && (
        <div className={styles.bottomPrimary}>
          {renderBar(
            bottomPrimary,
            TO.HORIZONTAL,
            WS.BOTTOM_PRIMARY,
            handleNavigate,
          )}
        </div>
      )}
    </div>
  );
};
