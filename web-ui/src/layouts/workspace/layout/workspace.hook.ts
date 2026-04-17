import type { WorkspaceConfig } from "./layout.types";
import { WORKSPACE_SLOTS as WS } from "../const/layout";

export const useWorkspaceConfig = () => {
  const workspaceConfigDefaults: WorkspaceConfig = {
    [WS.TOP_PRIMARY]: [{ id: "t1", type: "text", text: "Home", route: "home" }],
    [WS.TOP_SECONDARY]: [
      { id: "t1", type: "text", text: "Home", route: "home" },
    ],
    [WS.BOTTOM_PRIMARY]: [
      { id: "t1", type: "text", text: "Home", route: "home" },
    ],
    [WS.BOTTOM_SECONDARY]: [
      { id: "t1", type: "text", text: "Home", route: "home" },
    ],
    [WS.LEFT_PRIMARY]: [
      {
        id: "t1",
        type: "icon",
        icon: "homeIcon",
        label: "Home Icon",
        route: "home",
      },
    ],
    [WS.LEFT_SECONDARY]: [
      {
        id: "t1",
        type: "icon",
        icon: "homeIcon",
        label: "Home Icon",
        route: "home",
      },
    ],
    [WS.RIGHT_PRIMARY]: [
      {
        id: "t1",
        type: "icon",
        icon: "homeIcon",
        label: "Home Icon",
        route: "home",
      },
    ],
    [WS.RIGHT_SECONDARY]: [
      {
        id: "t1",
        type: "dropdown",
        trigger: { type: "icon", icon: "homeIcon" },
        items: [
          {
            key: "man",
            route: "man",
            value: "Man",
          },
        ],
      },
    ],
  };

  return workspaceConfigDefaults;
};
