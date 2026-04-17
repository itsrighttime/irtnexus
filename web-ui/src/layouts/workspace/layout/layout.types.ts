import type { TabConfig } from "../bars";
import type { WORKSPACE_SLOTS } from "../const/layout";

export type WorkspaceConfig = {
  [WORKSPACE_SLOTS.TOP_PRIMARY]?: TabConfig[];
  [WORKSPACE_SLOTS.TOP_SECONDARY]?: TabConfig[];
  [WORKSPACE_SLOTS.BOTTOM_PRIMARY]?: TabConfig[];
  [WORKSPACE_SLOTS.BOTTOM_SECONDARY]?: TabConfig[];
  [WORKSPACE_SLOTS.LEFT_PRIMARY]?: TabConfig[];
  [WORKSPACE_SLOTS.LEFT_SECONDARY]?: TabConfig[];
  [WORKSPACE_SLOTS.RIGHT_PRIMARY]?: TabConfig[];
  [WORKSPACE_SLOTS.RIGHT_SECONDARY]?: TabConfig[];
};
