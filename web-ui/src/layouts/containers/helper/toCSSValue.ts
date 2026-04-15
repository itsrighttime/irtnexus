import type { CSSMap } from "../types";

const map: CSSMap = {
  direction: {
    row: "row",
    column: "column",
  },
  justify: {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  },
  align: {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
  },
  wrap: {
    wrap: "wrap",
    nowrap: "nowrap",
    "wrap-reverse": "wrap-reverse",
  },
};

/** ------------------ FUNCTION ------------------ */

export const toCSSValue = (key: keyof CSSMap, value: string): string => {
  return (map[key] as Record<string, string>)?.[value] || value;
};
