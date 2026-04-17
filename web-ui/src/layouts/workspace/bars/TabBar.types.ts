import type { IconTypes } from "@/assets";
import type { DropdownItem } from "@/atoms";
import { TAB_TYPE } from "../const";
import type { TabOrientation, TabType } from "../const";
import type { WorkspaceSlot } from "../const/layout";

type BaseTab = {
  id: string;
  type: TabType;
  route?: string;
};

type TextTab = BaseTab & {
  type: typeof TAB_TYPE.TEXT;
  text: string;
  onClick?: () => void;
};

type IconTab = BaseTab & {
  type: typeof TAB_TYPE.ICON;
  icon: IconTypes;
  label?: string;
  onClick?: () => void;
};

type DropdownTab = BaseTab & {
  type: typeof TAB_TYPE.DROPDOWN;
  trigger: {
    type: typeof TAB_TYPE.TEXT | typeof TAB_TYPE.ICON;
    text?: string;
    icon?: IconTypes;
  };
  items: DropdownItem[];
  onSelect?: (key: string | number) => void;
};

type CustomTab = BaseTab & {
  type: typeof TAB_TYPE.CUSTOM;
  render: () => React.ReactNode;
};

export type TabIconItem = {
  icon: IconTypes;
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
  color?: string;
  clickable?: boolean; // NEW: controls IconButton vs static icon
};

export type TabToken = {
  text: string;
  color?: string;
  background?: string;
};

export type TabLabelProps = {
  leftIcons?: TabIconItem[];
  rightIcons?: TabIconItem[];

  tokens?: TabToken[];

  text: string;
  border?: string | null;
  background?: string | null;

  onClick?: () => void;
};

type LabelTab = BaseTab &
  TabLabelProps & {
    type: typeof TAB_TYPE.LABEL;
  };

export type TabConfig = TextTab | IconTab | DropdownTab | CustomTab | LabelTab;

export type SidebarTab = LabelTab;

export type TabBarConfig = {
  position?: WorkspaceSlot;
  orientation?: TabOrientation;
  start?: TabConfig[];
  center?: TabConfig[];
  end?: TabConfig[];
};

export type onActionType = (payload: {
  route?: string;
  key?: string | number;
}) => void;
