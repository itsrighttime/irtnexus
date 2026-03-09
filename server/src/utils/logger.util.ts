// src/utils/logger.ts
import { UtilsLogger } from "#packages";
import { LogMessage, Logger } from "#types";

const { fileLogger } = UtilsLogger;

const formatMessage = (msg: LogMessage): string => {
  if (typeof msg === "string") return msg;
  if (msg instanceof Error) return msg.message;
  return String(msg);
};

export const logger: Logger = {
  info: (message, context = null, code = "N/A") =>
    fileLogger.info({ message: formatMessage(message), context, code }),

  warn: (message, context = null, code = "N/A") =>
    fileLogger.warn({ message: formatMessage(message), context, code }),

  verbose: (message, context = null, code = "N/A") =>
    fileLogger.verbose({ message: formatMessage(message), context, code }),

  debug: (message, context = null, code = "N/A") =>
    fileLogger.debug({ message: formatMessage(message), context, code }),

  silly: (message, context = null, code = "N/A") =>
    fileLogger.silly({ message: formatMessage(message), context, code }),

  error: (message: LogMessage, error?: unknown, code = "N/A") => {
    const formattedMessage = formatMessage(message);

    if (error instanceof Error) {
      // fileLogger.error({
      //   message: formattedMessage,
      //   error: error.message,
      //   stack: error.stack,
      //   code,
      // });
      console.error(message, error);
    } else {
      fileLogger.error({
        message: formattedMessage,
        error: error ? String(error) : null,
        code,
      });
    }
  },
};
