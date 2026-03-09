import { translate } from "#translations";
import { logger } from "#utils";

/**
 * Global Express Error Handler
 * @param {Error} err - The error object
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const globalErrorHandler = (err, req, res, next) => {
  // Default error values
  const statusCode = err.statusCode || 500;
  const messageKey = "error.default";
  const details = err.details || null;

  // Translate the error message
  const message = translate(messageKey, err.options || {});

  // Log the error for debugging
  logger.error({
    statusCode,
    message: err.message,
    stack: err.stack,
    details,
    path: req.originalUrl,
    method: req.method,
  });

  // Send JSON response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    details,
  });
};
