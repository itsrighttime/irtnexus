import { languagesData } from "#translations/languageData.js";
import { logger } from "#utils";
import i18n from "i18n";
import path from "path";

/**
 * i18n (Internationalization) Configuration
 *
 * Sets up multi-language support for the application using the `i18n` package.
 * This configuration allows the app to serve content in multiple languages based on user preference.
 */
i18n.configure({
  /** Supported locales/languages */
  locales: ["en", "fr", "es"],

  /** Default language if none is specified or detected */
  defaultLocale: "en",

  /** Enable object notation for nested translations, e.g., "greetings.hello" */
  objectNotation: true,

  /** Automatically reload locale files when they change (useful in development) */
  autoReload: true,

  /** Synchronize locale information across files */
  syncFiles: true,

  /** Preloaded translation data (from static JS object) */
  staticCatalog: languagesData,

  // Optionally, you could specify a directory for JSON files:
  // directory: path.join(__dirname, "locales"),
});

/**
 * Export the configured i18n instance
 */
export { i18n };
