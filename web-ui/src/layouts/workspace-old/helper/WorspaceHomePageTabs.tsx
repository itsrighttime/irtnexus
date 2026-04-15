"use client";

import React, { useEffect } from "react";

import { Icons } from "@/assets";
import styles from "../css/WorkspaceHomePage.module.css";
import { Tab } from "./Tab.js";
import { workspaceKeys } from "./workspaceKeys.js";
import { workspaceLabels } from "./workspaceLabels.js";
import {
  getWorspaceHomeTabsApi,
  type NotificationDropdownItem,
} from "./workspaceLayoutApi.js";
import { useAuth } from "../context/index.js";
import { IconButton } from "@/atoms/button/IconButton.js";

const { profileIcon, logoutIcon, reminderIcon, screenModeIcon } = Icons;

function convertToDictionary(
  dataArray: NotificationDropdownItem[],
): Record<string, number | string | undefined> {
  const result: Record<string, number | string | undefined> = {};
  dataArray.forEach((item) => {
    result[item.key] = item.box?.[0];
  });
  return result;
}

interface WorkspaceHomePageTabsProps {
  toggleFullscreen: () => void;
  setProductNotification: (
    value: Record<string, number | string | undefined>,
  ) => void;
}

export const WorkspaceHomePageTabs: React.FC<WorkspaceHomePageTabsProps> = ({
  toggleFullscreen,
  setProductNotification,
}) => {
  const { handleLogout } = useAuth();
  const { myProfile, notification } = getWorspaceHomeTabsApi();

  useEffect(() => {
    if (notification?.dropdown) {
      setProductNotification(
        convertToDictionary(
          notification.dropdown as NotificationDropdownItem[],
        ),
      );
    }
  }, [notification?.dropdown, setProductNotification]);

  return (
    <div className={styles.extraIcons}>
      <Tab
        icon={profileIcon}
        mykey={workspaceKeys.myProfile}
        value={workspaceLabels.myProfile}
        dropdown={myProfile.dropdown}
        onClick={(value: string) => {
          console.log("WorkSpace Home Profile Click: ", value);
        }}
      />

      <IconButton
        icon={logoutIcon}
        label={workspaceLabels.logout}
        onClick={handleLogout}
        size={1.2}
      />
      <Tab
        icon={reminderIcon}
        mykey={workspaceKeys.notification}
        value={workspaceLabels.notification}
        dropdown={notification.dropdown as any}
        onClick={(value: string) => {
          console.log("WorkSpace Home Notification Click: ", value);
        }}
        extra={{
          total: notification.total,
        }}
      />
      <IconButton
        icon={screenModeIcon}
        label={workspaceLabels.toggleFullscreen}
        onClick={toggleFullscreen}
        size={1.2}
        color={"var(--colorRed)"}
      />
    </div>
  );
};
