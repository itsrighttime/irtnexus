export const SIZES = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const;
export type Size = (typeof SIZES)[keyof typeof SIZES];

export const RADIUS = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;
export type Radius = (typeof RADIUS)[keyof typeof RADIUS];
