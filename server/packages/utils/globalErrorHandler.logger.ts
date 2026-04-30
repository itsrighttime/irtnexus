import { FastifyRequest, FastifyReply } from "fastify";
import { HTTP_STATUS, response } from "./response";
import { AppError, AppErrorParams } from "../errors";
import { logger } from "./logger.util";

/**
 * Global Fastify error handler
 * Should be registered as `setErrorHandler` in Fastify
 */
export function globalErrorHandler(
  error: AppErrorParams | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // If the error is one of our AppErrors
  if (error instanceof AppError) {
    const payload = {
      message: error.message,
      ...error.details,
    };

    return response.error(
      request,
      reply,
      payload,
      error.message,
      error.uniqueCode,
      error.details.statusCode || error.statusCode || 500,
    );
  }

  // Handle Fastify validation errors (from schema validation)
  if ((error as any).validation) {
    const validationError = error as any;
    const errors: Record<string, string> = {};
    validationError.validation.forEach((err: any) => {
      const field = err.instancePath.replace(/^\//, "") || err.schemaPath;
      errors[field] = err.message;
    });

    return response.error(
      request,
      reply,
      errors,
      "Validation failed",
      "VALIDATION_FAILED",
      HTTP_STATUS.x4_BAD_REQUEST,
    );
  }

  // Fallback for unexpected/unhandled errors
  logger.error("Unexpected error:", error);

  return response.error(
    request,
    reply,
    { error: error.message },
    "Internal Server Error",
    "INTERNAL_SERVER_ERROR",
    HTTP_STATUS.x5_INTERNAL_SERVER_ERROR,
  );
}
