"use client";

import { TabBar } from "../bars";
import { TAB_ORIENTATION as TO, type TabOrientation } from "../const";
import { WORKSPACE_SLOTS as WS, type WorkspaceSlot } from "../const/layout";
import { Sidebar } from "../sidebars/Sidebar";
import type { WorkspaceConfig } from "./layout.types";
import styles from "./Workspace.module.css";

const renderBar = (
  tabs?: any,
  orientation: TabOrientation = TO.HORIZONTAL,
  position: WorkspaceSlot = WS.TOP_PRIMARY,
) => {
  if (!tabs?.length) return null;

  return <TabBar config={{ orientation, position, start: tabs }} />;
};

const workspaceConfigDefaults: WorkspaceConfig = {
  [WS.TOP_PRIMARY]: [{ id: "t1", type: "text", text: "Home" }],
  [WS.TOP_SECONDARY]: [{ id: "t1", type: "text", text: "Home" }],
  [WS.BOTTOM_PRIMARY]: [{ id: "t1", type: "text", text: "Home" }],
  [WS.BOTTOM_SECONDARY]: [{ id: "t1", type: "text", text: "Home" }],
  [WS.LEFT_PRIMARY]: [
    { id: "t1", type: "icon", icon: "homeIcon", label: "Home Icon" },
  ],
  [WS.LEFT_SECONDARY]: [
    { id: "t1", type: "icon", icon: "homeIcon", label: "Home Icon" },
  ],
  [WS.RIGHT_PRIMARY]: [
    { id: "t1", type: "icon", icon: "homeIcon", label: "Home Icon" },
  ],
  [WS.RIGHT_SECONDARY]: [
    { id: "t1", type: "icon", icon: "homeIcon", label: "Home Icon" },
  ],
};

export const Workspace = () => {
  const {
    [WS.TOP_PRIMARY]: topPrimary,
    [WS.TOP_SECONDARY]: topSecondary,
    [WS.BOTTOM_PRIMARY]: bottomPrimary,
    [WS.BOTTOM_SECONDARY]: bottomSecondary,
    [WS.LEFT_PRIMARY]: leftPrimary,
    [WS.LEFT_SECONDARY]: leftSecondary,
    [WS.RIGHT_PRIMARY]: rightPrimary,
    [WS.RIGHT_SECONDARY]: rightSecondary,
  } = workspaceConfigDefaults;

  return (
    <div className={styles.workspace}>
      <div className={styles.primaryHorizontal}>
        <div className={styles.topPrimary}>
          {renderBar(topPrimary, TO.HORIZONTAL, WS.TOP_PRIMARY)}
        </div>
        <div className={styles.primaryVertical}>
          <div className={styles.leftPrimary}>
            {renderBar(leftPrimary, TO.VERTICAL, WS.LEFT_PRIMARY)}
          </div>
          <div className={styles.leftSecondary}>
            {renderBar(leftSecondary, TO.VERTICAL, WS.LEFT_SECONDARY)}
          </div>
          <div className={styles.leftSidebar}>
            <Sidebar position="left" />
          </div>
          <div className={styles.secondaryHorizontal}>
            <div className={styles.topSecondary}>
              {renderBar(topSecondary, TO.HORIZONTAL, WS.TOP_SECONDARY)}
            </div>
            <div className={styles.content}>
              <h1>Workspace Content</h1>
            </div>
            <div className={styles.bottomSecondary}>
              {renderBar(bottomSecondary, TO.HORIZONTAL, WS.BOTTOM_SECONDARY)}
            </div>
          </div>
          <div className={styles.rightSidebar}>
            <Sidebar position="right" />
          </div>
          <div className={styles.rightPrimary}>
            {renderBar(rightPrimary, TO.VERTICAL, WS.RIGHT_PRIMARY)}
          </div>
          <div className={styles.rightSecondary}>
            {renderBar(rightSecondary, TO.VERTICAL, WS.RIGHT_SECONDARY)}
          </div>
        </div>

        <div className={styles.bottomPrimary}>
          {renderBar(bottomPrimary, TO.HORIZONTAL, WS.BOTTOM_PRIMARY)}
        </div>
      </div>
    </div>
  );
};
