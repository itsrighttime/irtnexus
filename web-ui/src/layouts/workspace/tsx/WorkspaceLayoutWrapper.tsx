"use client";

import React, { useState, useEffect } from "react";
import { WorkspaceLayout } from "./WorkspaceLayout.js";
import { LockScreen } from "./LockScreen.js";

import { workspaceKeys } from "../helper/workspaceKeys.js";

import { useUserActiveOnTab } from "@/hooks/useUserActiveOnTab.js";
import { useAuth, useDynamicContent } from "../context/index.js";
import { ErrorPage } from "@/atoms/index.js";

export const ScreenType = {
  MAGIC_SCREEN: "magicScreen",
  FULL_SCREEN: "fullScreen",
  LOGOUT_SCREEN: "logoutScreen",
} as const;

export type ScreenTypeValue = (typeof ScreenType)[keyof typeof ScreenType];

interface WorkspaceLayoutWrapperProps {
  toggleFullscreen: () => void;
}

export const WorkspaceLayoutWrapper: React.FC<WorkspaceLayoutWrapperProps> = ({
  toggleFullscreen,
}) => {
  const { userDetails } = useAuth() as {
    userDetails?: { user: { screenType: ScreenTypeValue } };
  };
  const isActive: boolean = useUserActiveOnTab(5);
  const [locked, setLocked] = useState<ScreenTypeValue | undefined>(
    userDetails?.user?.screenType,
  );
  const { setValue } = useDynamicContent() as {
    setValue: (key: string, value: unknown) => void;
  };

  useEffect(() => {
    setValue(workspaceKeys.magicLock, () => {
      console.log("Locking screen");
      setLocked(ScreenType.MAGIC_SCREEN);
    });
  }, []);

  if (!isActive && !locked) setLocked(ScreenType.MAGIC_SCREEN);

  const unlockMagicScreen = () => setLocked(ScreenType.FULL_SCREEN);

  return locked === ScreenType.MAGIC_SCREEN ? (
    <LockScreen
      handleUnlock={(_key: string | null) => {
        unlockMagicScreen();
      }}
    />
  ) : locked === ScreenType.FULL_SCREEN ? (
    <WorkspaceLayout toggleFullscreen={toggleFullscreen} api={"letsSecure"} />
  ) : (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ErrorPage
      {...({
        ErrorMsg: "Something is Wrong in WorkspaceLayoutFullScreen",
      } as any)}
    />
  );
};
