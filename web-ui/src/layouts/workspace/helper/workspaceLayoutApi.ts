import { workspaceLayoutKeys } from "./workspaceLayoutKeys.js";
import type { WorkspaceApiResponse, DropdownItem } from "./types.js";

const { LEVELS, ZONES, POSITIONS } = workspaceLayoutKeys;

export const workspaceLayoutApi = (
  api: string,
): WorkspaceApiResponse | null => {
  // TODO: URL validation will be done at the backend
  console.log("Called!");
  return {
    content: {
      data: `Page for ${api || "Home"}`,
      workspaceName: "letsDiscuss",
    },
    [LEVELS.primary]: generateTabSet("Level1"),
    [LEVELS.secondary]: generateTabSet("Level2"),
    myProfile,
    notification,
  } as WorkspaceApiResponse;
};

export const getWorspaceHomeTabsApi = (): {
  myProfile: typeof myProfile;
  notification: typeof notification;
} => {
  return { myProfile, notification };
};

interface RawTab {
  key: string;
  value: string;
  isIcon: boolean;
  dropdown: DropdownItem[] | null;
}

type ZoneTabSet = Partial<Record<string, RawTab[]>>;
type GeneratedTabSet = Partial<Record<string, ZoneTabSet | null>>;

const generateTabSet = (label: string): GeneratedTabSet => ({
  [ZONES.commandBar]: getZoneTabs(ZONES.commandBar, label),
  [ZONES.statusBar]: getZoneTabs(ZONES.statusBar, label),
  [ZONES.sidebar]: getZoneTabs(ZONES.sidebar, label),
  [ZONES.tools]: label === "Level1" ? getZoneTabs(ZONES.tools, label) : null,
});

const getZoneTabs = (zone: string, label: string): ZoneTabSet => ({
  [POSITIONS.start]: createTabs(
    ["Home", "Home3", "Home2"],
    zone,
    label,
    POSITIONS.start,
  ),
  [POSITIONS.center]: createTabs(
    ["About", "About1", "About2"],
    zone,
    label,
    POSITIONS.center,
  ),
  [POSITIONS.end]: createTabs(["C1", "C2", "C3"], zone, label, POSITIONS.end),
});

const createTabs = (
  values: string[],
  zone: string,
  label: string,
  position: string,
): RawTab[] =>
  values.map((val, index) => ({
    key: `${position}${zone}${label}${index}`,
    value: val,
    isIcon: [ZONES.sidebar as string, ZONES.tools as string].includes(zone),
    dropdown: [ZONES.sidebar as string, ZONES.tools as string].includes(zone)
      ? dropdown
      : null,
  }));

const dropdown: DropdownItem[] = [
  { key: "dropdownkey1", value: "Dropdown Key 1", description: "Ctrl + K + h" },
  { key: "dropdownkey2", value: "Dropdown Key 2", description: "Ctrl + K + h" },
  { key: "dropdownkey3", value: "Dropdown Key 3" },
];

const profileDropdown: DropdownItem[] = [
  {
    key: "myProfile2",
    value: "Danishan",
    description: "Technical Product Lead",
  },
  { key: "myAccount", value: "Account" },
];

export interface NotificationDropdownItem extends Omit<DropdownItem, "box"> {
  box?: (number | string)[];
}

const notificationDropdown: NotificationDropdownItem[] = [
  {
    key: "letsSecure",
    value: "letsSecure",
    box: [17, 18, "Man", 0, ""],
    description: "Critical",
  },
  {
    key: "letsDiscuss",
    value: "letsDiscuss",
    box: [5000],
    description: "Important",
  },
];

const myProfile = {
  dropdown: profileDropdown,
};

const notification = {
  total: 100,
  dropdown: notificationDropdown,
};
