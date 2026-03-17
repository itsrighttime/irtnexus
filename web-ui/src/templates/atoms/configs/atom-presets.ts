import { ATOMS } from "./atoms";
import { PRESETS } from "./presets";
import { RADIUS, SIZES } from "./settings";

export const ATOM_PRESETS = {
  // -------------------- BUTTON --------------------
  [ATOMS.BUTTON]: {
    // Variant: PRIMARY
    [PRESETS.BUTTON.A.PRIMARY]: {
      [PRESETS.BUTTON.B.DEFAULT]: {
        size: SIZES.MEDIUM,
        radius: RADIUS.MD,
        variant: PRESETS.BUTTON.A.PRIMARY,
      },
      [PRESETS.BUTTON.B.SMALL]: {
        size: SIZES.SMALL,
        radius: RADIUS.SM,
        variant: PRESETS.BUTTON.A.PRIMARY,
      },
    },
    // Variant: SECONDARY
    [PRESETS.BUTTON.A.SECONDARY]: {
      [PRESETS.BUTTON.B.DEFAULT]: {
        size: SIZES.MEDIUM,
        radius: RADIUS.MD,
        variant: PRESETS.BUTTON.A.SECONDARY,
      },
    },
  },

  // -------------------- TEXT INPUT --------------------
  [ATOMS.TEXT_INPUT]: {
    [PRESETS.BUTTON.B.DEFAULT]: {
      size: SIZES.MEDIUM,
      radius: RADIUS.MD,
      variant: PRESETS.BUTTON.A.PRIMARY,
    },
    [PRESETS.BUTTON.B.ERROR]: {
      size: SIZES.MEDIUM,
      radius: RADIUS.MD,
      variant: PRESETS.BUTTON.A.SECONDARY, // error style
    },
  },

  // -------------------- BADGE --------------------
  [ATOMS.BADGE]: {
    [PRESETS.BUTTON.B.DEFAULT]: {
      variant: PRESETS.BUTTON.A.PRIMARY,
    },
    [PRESETS.BUTTON.B.SUCCESS]: {
      variant: PRESETS.BUTTON.B.SUCCESS,
    },
    [PRESETS.BUTTON.B.ERROR]: {
      variant: "destructive",
    },
  },
} as const;