"use client";

// hooks/useWorkspaceLayout.ts
import { useEffect, useState, useMemo } from "react";
import { workspaceLayoutApi } from "./workspaceLayoutApi.js";
import { formateTabsDetails } from "./formateTabsDetails.js";
import { workspaceKeys } from "./workspaceKeys.js";

import { useNavigate, useParams } from "react-router-dom";
import { makeUrl } from "./urlFormatter.js";
import type {
  ZoneTabsMap,
  ClickHandlerArgs,
  ClickHandlerReturn,
} from "./types.js";
import { useAuth, useDynamicContent, useTabHandler } from "../context/index.js";
import { fromKebabCase } from "./caseConverter.js";
import { setDocumentTitle } from "./setDocumentTitle.js";

interface UseWorkspaceLayoutArgs {
  api: string;
  level: number;
  maxDepth?: number;
  providedTabs: ZoneTabsMap | null;
  providedContent: string | null;
  toggleFullscreen: () => void;
}

interface UseWorkspaceLayoutResult {
  tabsPrimary: ZoneTabsMap | null;
  tabsSecondary: ZoneTabsMap | null;
  content: string | null;
  cssVariable: Record<string, string>;
  navigatorSize: string;
}

export const useWorkspaceLayout = ({
  api,
  level,
  providedTabs,
  providedContent,
  toggleFullscreen,
}: UseWorkspaceLayoutArgs): UseWorkspaceLayoutResult => {
  const [tabsPrimary, setTabsPrimary] = useState<ZoneTabsMap | null>(
    providedTabs,
  );
  const [tabsSecondary, setTabsSecondary] = useState<ZoneTabsMap | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>(api);
  const [content, setContent] = useState<string | null>(providedContent);
  const { tabClickHandler } = useTabHandler() as {
    tabClickHandler: (value: string) => void;
  };
  const { getValue, setValue } = useDynamicContent() as {
    getValue: (key: string) => unknown;
    setValue: (key: string, value: unknown) => void;
  };
  const { handleLogout } = useAuth() as { handleLogout: () => void };
  const navigate = useNavigate();
  const {
    workspaceId,
    level: levelParam,
    zone,
    position,
    tabKey,
  } = useParams<{
    workspaceId: string;
    level: string;
    zone: string;
    position: string;
    tabKey: string;
  }>();

  const handleMagicLock = getValue(workspaceKeys.magicLock) as
    | (() => void)
    | undefined;
  const navigatorSize = "32px";

  const defaultTabsHandler: Record<string, (value: string) => void> = {
    [workspaceKeys.magicLock]: handleMagicLock ?? (() => {}),
    [workspaceKeys.logout]: handleLogout,
    [workspaceKeys.myProfile]: (value: string) => {
      console.log(value);
    },
    [workspaceKeys.notification]: (value: string) => {
      console.log(value);
    },
  };

  const clickHandler = ({
    tab,
    value,
    isWorkspace = false,
  }: ClickHandlerArgs): ClickHandlerReturn => {
    if (value) setDocumentTitle(value);
    const createdUrl = makeUrl(
      { ...tab, workspaceId: workspaceId ?? "" },
      isWorkspace,
    );
    const finalUrl = tab.key === workspaceKeys.workspaceHome ? "/" : createdUrl;

    setCurrentUrl(finalUrl);
    navigate(finalUrl);
    return {
      ...defaultTabsHandler,
      onClick: tabClickHandler,
    };
  };

  useEffect(() => {
    if (level === 1 && currentUrl) {
      const response = workspaceLayoutApi(currentUrl);

      if (!response) {
        setContent(null);
        setTabsPrimary(null);
        setTabsSecondary(null);
      } else {
        setValue(workspaceKeys.tabClickedKey, fromKebabCase(tabKey ?? ""));
        const formattedTabs = formateTabsDetails({
          data: response,
          toggleFullscreen,
          clickHandler,
        });

        setTabsPrimary(formattedTabs.primary ?? null);
        setTabsSecondary(formattedTabs.secondary ?? null);
        setContent(response.content.data);
      }
    }
  }, [
    currentUrl,
    level,
    handleMagicLock,
    workspaceId,
    levelParam,
    zone,
    position,
    tabKey,
  ]);

  const cssVariable = useMemo((): Record<string, string> => {
    const heightFactor =
      Number(Boolean(tabsPrimary?.commandBar)) +
      Number(Boolean(tabsPrimary?.statusBar));
    const widthFactor =
      Number(Boolean(tabsPrimary?.sidebar)) +
      Number(Boolean(tabsPrimary?.tools));
    const value = parseFloat(navigatorSize);

    return {
      "--navigatorSize": navigatorSize,
      "--navigatorHeight": `${heightFactor * value}px`,
      "--navigatorWidth": `${widthFactor * value}px`,
    };
  }, [tabsPrimary]);

  return {
    tabsPrimary,
    tabsSecondary,
    content,
    cssVariable,
    navigatorSize,
  };
};
