export type Direction = "row" | "column";

export type Justify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export type Align = "start" | "center" | "end" | "stretch";

export type Wrap = "wrap" | "nowrap" | "wrap-reverse";

export type CSSMap = {
  direction: Record<Direction, string>;
  justify: Record<Justify, string>;
  align: Record<Align, string>;
  wrap: Record<Wrap, string>;
};
