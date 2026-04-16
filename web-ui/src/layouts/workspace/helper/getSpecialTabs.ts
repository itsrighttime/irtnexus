import { workspaceKeys } from "./workspaceKeys.js";
import { getIconByKey } from "./getIconByKey.js";
import { workspaceLayoutKeys } from "./workspaceLayoutKeys.js";
import { Icons } from "@/assets/icons/index.js";
import { workspaceLabels } from "./workspaceLabels.js";
import type {
  TabItem,
  Section,
  WorkspaceApiResponse,
  ClickHandlerArgs,
  ClickHandlerReturn,
} from "./types.js";
import { getProductLogo } from "@/assets/index.js";

const { LEVELS, ZONES, POSITIONS } = workspaceLayoutKeys;
const { homeIcon, profileIcon, reminderIcon } = Icons;

interface GetSpecialTabsArgs {
  section: Section;
  data: WorkspaceApiResponse;
  clickHandler: (args: ClickHandlerArgs) => ClickHandlerReturn;
  toggleFullscreen: () => void;
}

export const getSpecialTabs = ({
  section,
  data,
  clickHandler,
  toggleFullscreen,
}: GetSpecialTabsArgs): TabItem[] => {
  const { level, zone, position } = section;
  const specialTabs: TabItem[] = [];

  const isPosition = (lvl: string, zn: string, pos: string): boolean =>
    level === lvl && zone === zn && position === pos;

  const isTopEnd = isPosition(LEVELS.primary, ZONES.commandBar, POSITIONS.end);
  const isTopStart = isPosition(
    LEVELS.primary,
    ZONES.commandBar,
    POSITIONS.start,
  );
  const isLeftEnd = isPosition(LEVELS.primary, ZONES.sidebar, POSITIONS.end);
  const isRightStart = isPosition(LEVELS.primary, ZONES.tools, POSITIONS.start);

  // Top-right: Lock + Logout + Fullscreen
  if (isTopEnd) {
    specialTabs.push({
      key: workspaceKeys.workspaceHome,
      value: workspaceLabels.workspaceHome,
      icon: homeIcon,
      onClick: (clickedValue: string) =>
        clickHandler({ tab: { key: clickedValue, ...section } })[
          workspaceKeys.myProfile
        ](clickedValue),
    });

    specialTabs.push({
      key: workspaceKeys.myProfile,
      value: workspaceLabels.myProfile,
      icon: profileIcon,
      onClick: (clickedValue: string) =>
        clickHandler({ tab: { key: clickedValue, ...section } })[
          workspaceKeys.myProfile
        ](clickedValue),
      dropdown: data.myProfile.dropdown,
    });

    ([workspaceKeys.magicLock, workspaceKeys.logout] as string[]).forEach(
      (key) => {
        const label =
          key === workspaceKeys.magicLock
            ? workspaceLabels.magicLock
            : workspaceLabels.logout;

        specialTabs.push({
          key,
          value: label,
          icon: getIconByKey(key),
          onClick: (clickedValue: string) =>
            clickHandler({ tab: { key: clickedValue, ...section } })[key](
              clickedValue,
            ),
        });
      },
    );

    specialTabs.push({
      key: workspaceKeys.notification,
      value: workspaceLabels.notification,
      icon: reminderIcon,
      onClick: (clickedValue: string) =>
        clickHandler({ tab: { key: clickedValue, ...section } })[
          workspaceKeys.notification
        ](clickedValue),
      dropdown: data.notification.dropdown,
      extra: {
        total: data.notification.total,
      },
    });

    specialTabs.push({
      key: workspaceKeys.toggleFullscreen,
      value: workspaceLabels.toggleFullscreen,
      icon: getIconByKey(workspaceKeys.toggleFullscreen),
      onClick: toggleFullscreen,
    });
  }

  // Top-left: Workspace label
  if (isTopStart) {
    specialTabs.unshift({
      key: workspaceKeys.workspaceName,
      value: data?.content?.workspaceName ?? workspaceLabels.workspaceName,
      icon: null,
      onClick: () => {},
    });
  }

  // Left-sidebar: Workspace-level items
  if (isLeftEnd) {
    const renderingKeys = workspaceKeys.workspace;

    Object.values(renderingKeys).forEach((key) => {
      specialTabs.push({
        key,
        value: key,
        icon: getProductLogo(key),
        onClick: (clickedValue: string) =>
          clickHandler({
            tab: { key: clickedValue, ...section },
            isWorkspace: true,
          }),
      });
    });
  }

  // Right-sidebar: placeholder for future items
  if (isRightStart) {
  }

  return specialTabs;
};
