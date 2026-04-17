import type { WorkspaceConfig } from "@/layouts/workspace/layout/layout.types";
import { Workspace } from "@/layouts/workspace/layout/Workspace";

export const TestLayout = () => {
  const workspaceConfig: WorkspaceConfig = {
    top: [
      { id: "t1", type: "text", text: "Home" },
      { id: "t2", type: "icon", icon: "mediaIcon" },
    ],

    bottom: [{ id: "b1", type: "text", text: "Status OK" }],

    leftTop: [{ id: "l1", type: "icon", icon: "homeIcon" }],

    leftBottom: [{ id: "l2", type: "icon", icon: "BellIcon" }],

    rightTop: [
      {
        id: "r1",
        type: "dropdown",
        trigger: { type: "icon", icon: "DataIcon" },
        items: [],
      },
    ],

    rightBottom: [{ id: "r2", type: "icon", icon: "warningCloudIcon" }],
  };

  return (
    <div>
      <Workspace></Workspace>
    </div>
  );
};
