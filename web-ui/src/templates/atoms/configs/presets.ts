const ALL = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SMALL: "small",
  DEFAULT: "default",
  ERROR: "error",
  SUCCESS: "success",
  TERNARY: "tertiary",
  GHOST: "ghost",
  DESTRUCTIVE: "destructive",
} as const;

export const PRESETS = {
  BUTTON: {
    A: {
      PRIMARY: ALL.PRIMARY,
      SECONDARY: ALL.SECONDARY,
      TERNARY: ALL.TERNARY,
      GHOST: ALL.GHOST,
      DESTRUCTIVE: ALL.DESTRUCTIVE,
    },
    B: {
      SMALL: ALL.SMALL,
      DEFAULT: ALL.DEFAULT,
      ERROR: ALL.ERROR,
      SUCCESS: ALL.SUCCESS,
    },
  },
};

export type ButtonPreset = (typeof ALL)[keyof typeof ALL];
