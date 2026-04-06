export const ACCOUNT_NAME_TYPE = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  NICKNAME: "nickname",
  DISPLAY: "display",
  LEGAL: "legal",
} as const;

export type AccountNameType =
  (typeof ACCOUNT_NAME_TYPE)[keyof typeof ACCOUNT_NAME_TYPE];
