import { Workspace } from "@/layouts/workspace-old/tsx/Workspace";
import { handleOnClick } from "./helper/tabsHandler";

export const UseLayoutExample = () => {
  return <Workspace tabClickHandler={handleOnClick} />;
};
