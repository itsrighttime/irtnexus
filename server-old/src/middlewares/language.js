import { HEADERS } from "#config";
import { AsyncLocalStorage } from "async_hooks";

/**
 * AsyncLocalStorage instance used to maintain
 * request-scoped context across async calls.
 */
const asyncLocalStorage = new AsyncLocalStorage();

/**
 * Language middleware.
 *
 * Creates a per-request async context and stores
 * the resolved language so it can be accessed
 * anywhere during the request lifecycle.
 *
 * Resolution priority:
 * 1. Request header
 * 2. Query parameter
 * 3. Default ("en")
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export const languageMiddleware = (req, res, next) => {
  // Initialize a new async context for this request
  asyncLocalStorage.run(new Map(), () => {
    const store = asyncLocalStorage.getStore();

    // Detect language from header, query string, or fallback
    const lang = req.headers[HEADERS.LANGUAGE] || req.query.lang || "en";

    // Store language in the async context
    store.set(HEADERS.LANGUAGE, lang);

    next();
  });
};

/**
 * Retrieves the current request's language from async context.
 *
 * Safe to call from services, helpers, or DB layers.
 *
 * @returns {string|null} Language code or null if no context exists
 */
export const getLanguageContext = () => {
  const store = asyncLocalStorage.getStore();
  if (!store) return null;

  return store.get(HEADERS.LANGUAGE);
};
