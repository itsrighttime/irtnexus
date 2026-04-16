import { Workspace } from "@/layouts/workspace/tsx/Workspace";
import { handleOnClick } from "./helper/tabsHandler";
import { LockScreen } from "@/layouts/workspace/tsx/LockScreen";
import { WorkspaceHomePage } from "@/layouts/workspace/tsx/WorspaceHomePage";

export const UseLayoutExample = () => {
  return <>{<Workspace tabClickHandler={handleOnClick} />}</>;
};
