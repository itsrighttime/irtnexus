import { i18n } from "#config";
import { getLanguageContext } from "#middlewares";

export const translate = (key, options = {}) => {
  const locale = getLanguageContext() || "en";
  i18n.setLocale(locale);
  return i18n.__(key, options);
};
