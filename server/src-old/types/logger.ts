export interface LogContext {
  [key: string]: any;
}

export type LogMessage = string | Error;

export type LoggerMethod = (
  message: LogMessage,
  context?: LogContext | Error | null,
  code?: string,
) => void;

export interface Logger {
  info: LoggerMethod;
  warn: LoggerMethod;
  verbose: LoggerMethod;
  debug: LoggerMethod;
  silly: LoggerMethod;
  error: LoggerMethod;
}
