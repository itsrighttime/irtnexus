// src/config/i18n.ts
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { languagesData } from "#translations";

/**
 * i18next (Internationalization) Configuration
 *
 * Sets up multi-language support for the application.
 * Supports static translation data and file-based translations if needed.
 */
export async function initI18n() {
  await i18next.use(Backend).init({
    // Supported languages
    lng: "en", // default language
    fallbackLng: "en",
    preload: Object.keys(languagesData), // preload languages from static catalog
    resources: languagesData, // static translation object

    // Enable nested keys, e.g., "greetings.hello"
    keySeparator: ".",
    nsSeparator: ":",

    interpolation: {
      escapeValue: false, // not needed for Node.js
    },

    backend: {
      // optional: if you want to load JSON files later
      loadPath: "./src/translations/locales/{{lng}}/{{ns}}.json",
    },

    debug: process.env.NODE_ENV !== "production",
  });
}

/*

// Middleware for Fastify to attach i18next to request

export function i18nMiddleware(app: import("fastify").FastifyInstance) {
  app.addHook("preHandler", async (request, reply) => {
    // Example: detect language from header
    const lng =
      request.headers["accept-language"]?.toString().split(",")[0] || "en";
    request.i18n = i18next.cloneInstance({ lng });
  });
}

*/
