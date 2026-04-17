// workspaceLayoutKeys.ts

export const workspaceLayoutKeys = {
  LEVELS: {
    primary: "primary",
    secondary: "secondary",
  },
  ZONES: {
    sidebar: "sidebar",
    tools: "tools",
    commandBar: "commandBar",
    statusBar: "statusBar",
  },
  POSITIONS: {
    start: "start",
    center: "center",
    end: "end",
  },
} as const;

export type Level =
  (typeof workspaceLayoutKeys.LEVELS)[keyof typeof workspaceLayoutKeys.LEVELS];
export type Zone =
  (typeof workspaceLayoutKeys.ZONES)[keyof typeof workspaceLayoutKeys.ZONES];
export type Position =
  (typeof workspaceLayoutKeys.POSITIONS)[keyof typeof workspaceLayoutKeys.POSITIONS];
