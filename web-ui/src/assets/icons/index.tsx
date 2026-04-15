import * as IconsTemp from "./icons";
import * as Icons01 from "./list01";
import * as Icons02 from "./list02";

export const Icons = {
  ...IconsTemp,
  ...Icons01,
  ...Icons02,
} as const;
