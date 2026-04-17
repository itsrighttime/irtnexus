"use client";

// helper/formateTabsDetails.ts
import { formatSingleTab } from "./formatSingleTab.js";
import { getSpecialTabs } from "./getSpecialTabs.js";
import { workspaceLayoutKeys } from "./workspaceLayoutKeys.js";
import type {
  WorkspaceApiResponse,
  LevelTabsMap,
  ClickHandlerArgs,
  ClickHandlerReturn,
} from "./types.js";

const { LEVELS, ZONES, POSITIONS } = workspaceLayoutKeys;

interface FormateTabsDetailsArgs {
  data: WorkspaceApiResponse;
  toggleFullscreen: () => void;
  clickHandler: (args: ClickHandlerArgs) => ClickHandlerReturn;
}

export const formateTabsDetails = ({
  data,
  toggleFullscreen,
  clickHandler,
}: FormateTabsDetailsArgs): LevelTabsMap => {
  const result: LevelTabsMap = {};
  const levels = [LEVELS.primary, LEVELS.secondary];
  const zones = [ZONES.sidebar, ZONES.tools, ZONES.commandBar, ZONES.statusBar];
  const positions = [POSITIONS.start, POSITIONS.center, POSITIONS.end];

  for (const level of levels) {
    const levelData = data[level as keyof WorkspaceApiResponse] as Record<string, unknown> | undefined;
    if (!levelData) continue;

    result[level] = {};

    for (const zone of zones) {
      const zoneData = levelData[zone] as Record<string, unknown> | undefined;
      if (!zoneData) continue;

      result[level]![zone] = {};

      for (const position of positions) {
        const tabs = zoneData[position] as Parameters<typeof formatSingleTab>[0][] | undefined;
        if (!tabs) continue;

        const section = { level, zone, position };
        const formattedTabs = tabs.map((tab) =>
          formatSingleTab(tab, clickHandler, section)
        );

        const specialTabs = getSpecialTabs({
          section,
          data,
          clickHandler,
          toggleFullscreen,
        });

        result[level]![zone]![position] =
          position === POSITIONS.start
            ? [...specialTabs, ...formattedTabs]
            : [...formattedTabs, ...specialTabs];
      }
    }
  }

  return result;
};
