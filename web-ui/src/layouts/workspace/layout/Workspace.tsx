"use client";

import { TabBar, type onActionType } from "../bars";
import { TAB_ORIENTATION as TO, type TabOrientation } from "../const";
import { WORKSPACE_SLOTS as WS, type WorkspaceSlot } from "../const/layout";
import { Sidebar } from "../sidebars/Sidebar";
import type { WorkspaceConfig } from "./layout.types";
import styles from "./Workspace.module.css";
import { Outlet, useNavigate } from "react-router-dom";

const renderBar = (
  tabs?: any,
  orientation: TabOrientation = TO.HORIZONTAL,
  position: WorkspaceSlot = WS.TOP_PRIMARY,
  onAction?: onActionType,
) => {
  if (!tabs?.length) return null;

  return (
    <TabBar
      config={{ orientation, position, start: tabs }}
      onAction={onAction}
    />
  );
};

const workspaceConfigDefaults: WorkspaceConfig = {
  [WS.TOP_PRIMARY]: [{ id: "t1", type: "text", text: "Home", route: "home" }],
  [WS.TOP_SECONDARY]: [{ id: "t1", type: "text", text: "Home", route: "home" }],
  [WS.BOTTOM_PRIMARY]: [
    { id: "t1", type: "text", text: "Home", route: "home" },
  ],
  [WS.BOTTOM_SECONDARY]: [
    { id: "t1", type: "text", text: "Home", route: "home" },
  ],
  [WS.LEFT_PRIMARY]: [
    {
      id: "t1",
      type: "icon",
      icon: "homeIcon",
      label: "Home Icon",
      route: "home",
    },
  ],
  [WS.LEFT_SECONDARY]: [
    {
      id: "t1",
      type: "icon",
      icon: "homeIcon",
      label: "Home Icon",
      route: "home",
    },
  ],
  [WS.RIGHT_PRIMARY]: [
    {
      id: "t1",
      type: "icon",
      icon: "homeIcon",
      label: "Home Icon",
      route: "home",
    },
  ],
  [WS.RIGHT_SECONDARY]: [
    {
      id: "t1",
      type: "dropdown",
      trigger: { type: "icon", icon: "homeIcon" },
      items: [
        {
          key: "man",
          route: "man",
          value: "Man",
        },
      ],
    },
  ],
};

export const Workspace = () => {
  const navigate = useNavigate();

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
  } = workspaceConfigDefaults;

  const has = {
    topPrimary: !!topPrimary?.length,
    topSecondary: !!topSecondary?.length,
    bottomPrimary: !!bottomPrimary?.length,
    bottomSecondary: !!bottomSecondary?.length,
    leftPrimary: !!leftPrimary?.length,
    leftSecondary: !!leftSecondary?.length,
    rightPrimary: !!rightPrimary?.length,
    rightSecondary: !!rightSecondary?.length,
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

        {has.rightSidebar && (
          <div className={styles.leftSidebar}>
            <Sidebar position="left" />
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
        {has.leftSidebar && (
          <div className={styles.rightSidebar}>
            <Sidebar position="right" />
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
