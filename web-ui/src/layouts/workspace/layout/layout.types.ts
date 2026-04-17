import type { SidebarTab, BarTabs } from "../bars";
import type { WORKSPACE_SLOTS } from "../const/layout";

export type WorkspaceConfig = {
  [WORKSPACE_SLOTS.TOP_PRIMARY]?: BarTabs;
  [WORKSPACE_SLOTS.TOP_SECONDARY]?: BarTabs;
  [WORKSPACE_SLOTS.BOTTOM_PRIMARY]?: BarTabs;
  [WORKSPACE_SLOTS.BOTTOM_SECONDARY]?: BarTabs;
  [WORKSPACE_SLOTS.LEFT_PRIMARY]?: BarTabs;
  [WORKSPACE_SLOTS.LEFT_SECONDARY]?: BarTabs;
  [WORKSPACE_SLOTS.RIGHT_PRIMARY]?: BarTabs;
  [WORKSPACE_SLOTS.RIGHT_SECONDARY]?: BarTabs;
  [WORKSPACE_SLOTS.LEFT_SIDEBAR]?: SidebarTab[];
  [WORKSPACE_SLOTS.RIGHT_SIDEBAR]?: SidebarTab[];
};
