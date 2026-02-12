import { UtilsLogger } from "#packages";

const { fileLogger } = UtilsLogger;

/**
 * Centralized logger wrapper
 *
 * Provides convenient logging methods with structured metadata:
 *  - `message`: Human-readable log message
 *  - `context`: Optional object containing additional context
 *  - `code`: Optional code for categorizing log events
 *
 * All logs are delegated to the underlying `fileLogger` from UtilsLogger.
 */
export const logger = {
  /**
   * Info-level logs: business events or important milestones
   */
  info: (message, context = null, code = "N/A") =>
    fileLogger.info({ message, context, code }),

  /**
   * Warning-level logs: unexpected but recoverable events
   */
  warn: (message, context = null, code = "N/A") =>
    fileLogger.warn({ message, context, code }),

  /**
   * Verbose-level logs: detailed operational information
   */
  verbose: (message, context = null, code = "N/A") =>
    fileLogger.verbose({ message, context, code }),

  /**
   * Debug-level logs: developer-focused debugging information
   */
  debug: (message, context = null, code = "N/A") =>
    fileLogger.debug({ message, context, code }),

  /**
   * Silly-level logs: extremely verbose/noisy logs for tracing
   */
  silly: (message, context = null, code = "N/A") =>
    fileLogger.silly({ message, context, code }),

  /**
   * Error-level logs: critical failures or exceptions
   */
  error: (error) => fileLogger.error(error),
};

/**
 * Team Usage Guidelines:
 * - error → actual failures that need attention
 * - warn → unexpected but recoverable events
 * - info → business events or important milestones
 * - debug → developer-facing information, useful for debugging
 * - verbose → operational tracing, timing, or flow info
 * - silly → extremely detailed, noisy tracing for deep diagnostics
 */
