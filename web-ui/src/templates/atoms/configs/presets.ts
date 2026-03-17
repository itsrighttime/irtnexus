const ALL = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SMALL: "small",
  DEFAULT: "default",
  ERROR: "error",
  SUCCESS: "success",
} as const;

export const PRESETS = {
  BUTTON: {
    A: { PRIMARY: ALL.PRIMARY, SECONDARY: ALL.SECONDARY },
    B: {
      SMALL: ALL.SMALL,
      DEFAULT: ALL.DEFAULT,
      ERROR: ALL.ERROR,
      SUCCESS: ALL.SUCCESS,
    },
  },
};

export type ButtonPreset = (typeof ALL)[keyof typeof ALL];
