import * as IconsTemp from "./icons";
import * as Icons01 from "./list01";
import * as Icons02 from "./list02";
import * as Icons03 from "./list03";

export const Icons = {
  ...IconsTemp,
  ...Icons01,
  ...Icons02,
  ...Icons03,
} as const;

export type IconTypes = keyof typeof Icons;
