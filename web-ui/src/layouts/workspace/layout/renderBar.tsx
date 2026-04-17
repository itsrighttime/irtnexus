import { TabBar, type onActionType } from "../bars";
import { TAB_ORIENTATION as TO, type TabOrientation } from "../const";
import { WORKSPACE_SLOTS as WS, type WorkspaceSlot } from "../const/layout";

export const renderBar = (
  tabs?: any,
  orientation: TabOrientation = TO.HORIZONTAL,
  position: WorkspaceSlot = WS.TOP_PRIMARY,
  onAction?: onActionType,
) => {
  if (!tabs?.length) return null;

  return (
    <TabBar
      config={{ orientation, position, start: tabs }}
      onAction={onAction}
    />
  );
};
