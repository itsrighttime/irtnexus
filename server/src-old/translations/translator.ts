// src/utils/translate.ts
import i18next, { TOptions } from "i18next";
import { getLanguageContext } from "#middlewares";

/**
 * Translate a key using the current request language context.
 *
 * Automatically picks up the language from AsyncLocalStorage
 * or falls back to "en".
 *
 * @param key - Translation key, e.g., "greetings.hello"
 * @param options - Optional interpolation options for i18next
 * @returns Translated string
 */
export const translate = (key: string, options: TOptions = {}): string => {
  // Use language from async context or fallback to "en"
  const locale = getLanguageContext() || "en";

  // Set language for this translation call
  i18next.changeLanguage(locale);

  return i18next.t(key, options);
};
