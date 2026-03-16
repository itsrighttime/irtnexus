const COLOR = {
  simple: "#404040",
  blue: "#00b0f0",
  yellow: "#dbac2b",
  red: "#ff5969",
  cyan: "#52c9bd",
  green: "#92d050",
  skyBlue: "#05e1e7",
  gray1: "#f2f2f2",
  gray2: "#f7f7f7",
  gray3: "#d9d9d9",
  gray4: "#bbb9b9",
  gray5: "#7f7f7f",
  gray6: "#404040",
  white: "#fff",
  black: "#221d1d",
} as const;

type ColorName = keyof typeof COLOR;

/**
 * Returns the hex color code for a given color name.
 * Defaults to 'cyan' if the color name is not found.
 *
 * @param colorName - The name of the color (e.g., 'red', 'blue').
 * @returns Hex color code (e.g., '#ff5969').
 */
export const getColorCode = (colorName: string): string =>
  COLOR[colorName as ColorName] ?? COLOR.cyan;

export const BRAND_COLORS = {
  BLUE: "#00b0f0",
  DARK_BLUE: "#5b9bd5",
  YELLOW: "#dbac2b",
  RED: "#ff5969",
  CYAN: "#52c9bd",
  GREEN: "#92d050",
  SKY_BLUE: "#05e1e7",
  GRAY1: "#f7f7f7",
  GRAY2: "#f2f2f2",
  GRAY3: "#d9d9d9",
  GRAY4: "#bbb9b9",
  GRAY5: "#7f7f7f",
  GRAY6: "#404040",
  WHITE: "#fff",

  V_BLUE: "var(--colorBlue)",
  V_DARK_BLUE: "var(--colorDarkBlue)",
  V_YELLOW: "var(--colorYellow)",
  V_RED: "var(--colorRed)",
  V_CYAN: "var(--colorCyan)",
  V_GREEN: "var(--colorGreen)",
  V_SKY_BLUE: "var(--colorSkyBlue)",
} as const;

