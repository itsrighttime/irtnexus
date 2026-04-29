export const FORM_MAP_KEY = {
  PARTNERSHIP: "partnership",
  IRT_DEV: "irt-dev",
  IRT_CRE: "irt-cre",
  IRT: "irt",
  IRT_SHAN: "irt-shan",
  IRT_WS: "irt-ws",
} as const;

export type TypeFormMapKey = (typeof FORM_MAP_KEY)[keyof typeof FORM_MAP_KEY];
