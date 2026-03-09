import { UtilsError } from "#packages";
import { logger } from "#utils";

const { errorHandler } = UtilsError;

/**
 * Graceful Shutdown
 *
 * Handles application cleanup and exits the process safely.
 * This may include closing database connections, stopping workers, or flushing logs.
 *
 * @param {number} exitCode - Exit code to terminate the process with
 */
const gracefulShutdown = async (exitCode) => {
  try {
    logger.info("Shutting down gracefully...");
    // TODO: Perform cleanup tasks here (close DB, stop workers, flush logs, etc.)

    // Exit the process with the provided code
    process.exit(exitCode);
  } catch (shutdownError) {
    logger.error("Error during shutdown", shutdownError);
    process.exit(1); // Force exit with error code if cleanup fails
  }
};

/**
 * Handle Process-Level Errors
 *
 * Logs the error, delegates to the centralized error handler,
 * and performs a shutdown if the error is fatal or untrusted.
 *
 * @param {Error | any} error - The error object or reason
 * @param {boolean} isFatal - True if the error is critical and should terminate the process
 */
const handleProcessError = async (error, isFatal) => {
  logger.error(isFatal ? "Critical Error:" : "Process Error:", error);
  logger.error(error);

  // Delegate to centralized error handler
  await errorHandler.handleError(error);

  // Shutdown the process for fatal or untrusted errors
  if (!errorHandler.isTrustedError(error) || isFatal) {
    await gracefulShutdown(1);
  }
};

/**
 * Register Global Process Handlers
 *
 * Sets up listeners for uncaught exceptions, unhandled promise rejections, and termination signals.
 * Should be called **once at application startup**.
 */
export const registerProcessHandlers = () => {
  // Catch uncaught exceptions
  process.on("uncaughtException", (error) => handleProcessError(error, true));

  // Catch unhandled promise rejections
  process.on("unhandledRejection", (reason) =>
    handleProcessError(reason, false),
  );

  // Handle termination signal (e.g., `kill <pid>` or Kubernetes shutdown)
  process.on("SIGTERM", async () => {
    logger.info("Received SIGTERM, shutting down...");
    await gracefulShutdown(0);
  });

  // Handle interrupt signal (e.g., Ctrl+C)
  process.on("SIGINT", async () => {
    logger.info("Received SIGINT, shutting down...");
    await gracefulShutdown(0);
  });
};
