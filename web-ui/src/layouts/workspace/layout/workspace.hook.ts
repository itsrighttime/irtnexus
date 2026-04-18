import type { WorkspaceConfig } from "./layout.types";
import { WORKSPACE_SLOTS as WS } from "../const/layout";

export const useWorkspaceConfig = () => {
  const workspaceConfigDefaults: WorkspaceConfig = {
    [WS.TOP_PRIMARY]: {
      start: [{ id: "t1", type: "text", text: "Home", route: "home" }],
      center: [{ id: "t1", type: "text", text: "Home", route: "home" }],
      end: [{ id: "t1", type: "text", text: "Home", route: "home" }],
    },
    [WS.TOP_SECONDARY]: {
      start: [{ id: "t1", type: "text", text: "Home", route: "home" }],
    },
    [WS.BOTTOM_PRIMARY]: {
      start: [{ id: "t1", type: "text", text: "Home", route: "home" }],
    },
    [WS.BOTTOM_SECONDARY]: {
      start: [{ id: "t1", type: "text", text: "Home", route: "home" }],
    },
    [WS.LEFT_PRIMARY]: {
      start: [
        {
          id: "t1",
          type: "icon",
          icon: "homeIcon",
          label: "Home Icon",
          route: "home",
        },
      ],
      center: [
        {
          id: "t11",
          type: "icon",
          icon: "homeIcon",
          label: "Home Icon",
          route: "home",
        },
        {
          id: "t113",
          type: "icon",
          icon: "homeIcon",
          label: "Home Icon",
          route: "home",
        },
      ],
      end: [
        {
          id: "t12",
          type: "icon",
          icon: "homeIcon",
          label: "Home Icon",
          route: "home",
        },
      ],
    },
    [WS.LEFT_SIDEBAR]: [
      {
        id: "grp1",
        type: "group",
        title: "Main",
        defaultOpen: true,
        children: [
          {
            id: "t1",
            type: "label",
            text: "Home",
            leftIcons: [{ icon: "homeIcon" }],
            route: "home",
          },
          {
            id: "t2",
            type: "label",
            text: "Profile",
            leftIcons: [{ icon: "homeIcon" }],
            route: "profile",
          },
          {
            id: "grp11",
            type: "group",
            title: "Main 2",
            defaultOpen: true,
            children: [
              {
                id: "t1",
                type: "label",
                text: "Home",
                leftIcons: [{ icon: "homeIcon" }],
                route: "home",
              },
              {
                id: "t2",
                type: "label",
                text: "Profile",
                leftIcons: [{ icon: "homeIcon" }],
                route: "profile2",
              },
            ],
          },
        ],
      },
      {
        id: "grp2",
        type: "group",
        title: "Settings",
        children: [
          {
            id: "t3",
            type: "label",
            text: "Account",
            route: "account",
          },
        ],
      },
    ],
    [WS.LEFT_SECONDARY]: {
      start: [
        {
          id: "t1",
          type: "icon",
          icon: "homeIcon",
          label: "Home Icon",
          route: "home",
        },
      ],
    },
    [WS.RIGHT_PRIMARY]: {
      start: [
        {
          id: "t1",
          type: "icon",
          icon: "homeIcon",
          label: "Home Icon",
          route: "home",
        },
      ],
    },
    [WS.RIGHT_SECONDARY]: {
      start: [
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
    },
  };

  return workspaceConfigDefaults;
};
