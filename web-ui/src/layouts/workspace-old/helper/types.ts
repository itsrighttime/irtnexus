import type React from "react";

export interface DropdownItem {
  key: string;
  value: string;
  description?: string;
  box?: string[];
}

export interface TabItem {
  key: string;
  value: string;
  icon?: React.ComponentType | React.FC | null | string;
  onClick?: (value: string) => void;
  color?: string;
  dropdown?: DropdownItem[] | null;
  extra?: {
    total?: number;
  };
  isIcon?: boolean;
}

/** Tabs grouped by position key (start | center | end) */
export type TabsMap = Partial<Record<string, TabItem[]>>;

/** Tabs grouped by zone key (commandBar | sidebar | tools | statusBar) */
export type ZoneTabsMap = Partial<Record<string, TabsMap>>;

/** Tabs grouped by level key (primary | secondary) */
export type LevelTabsMap = Partial<Record<string, ZoneTabsMap>>;

export interface WorkspaceContent {
  data: string;
  workspaceName: string;
}

export interface WorkspaceApiResponse {
  content: WorkspaceContent;
  primary: ZoneTabsMap;
  secondary: ZoneTabsMap;
  myProfile: { dropdown: DropdownItem[] };
  notification: { total: number; dropdown: DropdownItem[] };
}

export interface Section {
  level: string;
  zone: string;
  position: string;
}

export interface ClickHandlerArgs {
  tab: { key: string } & Section;
  value?: string;
  isWorkspace?: boolean;
}

export type ClickHandlerReturn = Record<string, (value: string) => void> & {
  onClick: (value: string) => void;
};
