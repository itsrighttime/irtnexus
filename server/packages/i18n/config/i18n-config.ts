import { InitOptions } from "i18next";

export const i18nConfig: InitOptions = {
  fallbackLng: "en",

  keySeparator: ".",
  nsSeparator: ":",

  interpolation: {
    escapeValue: false,
  },

  debug: process.env.NODE_ENV !== "production",
};
