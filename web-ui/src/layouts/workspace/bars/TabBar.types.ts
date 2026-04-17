import type { IconTypes } from "@/assets";
import type { DropdownItem } from "@/atoms";

type TabType = "text" | "icon" | "dropdown" | "custom";

type BaseTab = {
  id: string;
  type: TabType;
};

type TextTab = BaseTab & {
  type: "text";
  text: string;
  onClick?: () => void;
};

type IconTab = BaseTab & {
  type: "icon";
  icon: IconTypes;
  label?: string;
  onClick?: () => void;
};

type DropdownTab = BaseTab & {
  type: "dropdown";
  trigger: {
    type: "text" | "icon";
    text?: string;
    icon?: IconTypes;
  };
  items: DropdownItem[];
  onSelect?: (key: string | number) => void;
};

type CustomTab = BaseTab & {
  type: "custom";
  render: () => React.ReactNode;
};

export type TabConfig = TextTab | IconTab | DropdownTab | CustomTab;

export type TabBarConfig = {
  orientation?: "horizontal" | "vertical";
  start?: TabConfig[];
  center?: TabConfig[];
  end?: TabConfig[];
};
