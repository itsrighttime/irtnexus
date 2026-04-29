import { formatMessage } from "./formats.helper.js";

type LogLevel = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

interface LogParams {
  message: string;
  context?: Record<string, unknown> | null;
  code?: string;
  error?: unknown;
}

interface Logger {
  error: (params: LogParams) => void;
  warn: (params: Omit<LogParams, "error">) => void;
  info: (params: Omit<LogParams, "error">) => void;
  verbose: (params: Omit<LogParams, "error">) => void;
  debug: (params: Omit<LogParams, "error">) => void;
  silly: (params: Omit<LogParams, "error">) => void;
}

export const __logger = (serviceName: string): Logger => {
  const logWithLevel =
    (level: Exclude<LogLevel, "error">) =>
    ({ message, context = null, code = "NA" }: Omit<LogParams, "error">) => {
      const { message: baseMsg, information } = formatMessage({
        level,
        serviceName,
        message,
        context,
        code,
      });
      console.log(baseMsg, information);
    };

  const logWithError = ({
    message,
    context = null,
    code = "NA",
    error,
  }: LogParams) => {
    const { information, message: baseMsg } = formatMessage({
      level: "error",
      serviceName,
      message,
      context,
      code,
    });
    console.error(baseMsg, information, error);
  };

  return {
    error: logWithError,
    warn: logWithLevel("warn"),
    info: logWithLevel("info"),
    verbose: logWithLevel("verbose"),
    debug: logWithLevel("debug"),
    silly: logWithLevel("silly"),
  };
};
