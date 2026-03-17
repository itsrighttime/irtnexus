export const ATOMS = {
  BUTTON: "Button",
  TEXT_INPUT: "TextInput",
  BADGE: "Badge",
} as const;

export type AtomName = typeof ATOMS[keyof typeof ATOMS];