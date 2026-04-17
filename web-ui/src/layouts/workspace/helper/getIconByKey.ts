import { Icons } from "@/assets/icons/index.js";
import { workspaceKeys } from "./workspaceKeys.js";

type IconComponent = React.FC | React.ComponentType;

const IconsMap: Record<string, IconComponent> = {
  [workspaceKeys.magicLock]: Icons.lockIcon,
  [workspaceKeys.logout]: Icons.logoutIcon,
  [workspaceKeys.toggleFullscreen]: Icons.screenModeIcon,
  home: Icons.homeIcon,
};

export const getIconByKey = (key: string): IconComponent => {
  return IconsMap[key] || Icons.analyticsIcon;
};
