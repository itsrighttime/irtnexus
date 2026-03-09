import { FastifyReply, FastifyRequest } from "fastify";
import { translate } from "#translations";
import { logger } from "#utils";
import { AppError } from "#types";

/**
 * Global Fastify error handler
 * @param err - The error object
 * @param request - FastifyRequest
 * @param reply - FastifyReply
 */
export const globalErrorHandler = (
  err: AppError,
  request: FastifyRequest,
  reply: FastifyReply,
): void => {
  // Default error values
  const statusCode = err.statusCode || 500;
  const messageKey = "error.default";
  const details = err.details || null;

  // Translate the error message
  // const message = translate(messageKey, err.options || {});
  const message = "Global Error"; // TODO

  // Log the error for debugging
  logger.error("Global Error : ", err);

  // Send JSON response
  reply.status(statusCode).send({
    success: false,
    statusCode,
    message,
    details,
  });
};
