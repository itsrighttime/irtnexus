import { getTrackingCode as getTrackingCodeHelper } from "./get-tracking-code.js";
import { __logger } from "./helper/logger.helper.js";

export const codeTypes = {
  info: "info",
  error: "error",
  warn: "warn",
  verbose: "verbose",
  debug: "debug",
  silly: "silly",
} as const;

export type CodeType = keyof typeof codeTypes;

let allowedTypes: CodeType[] = [
  codeTypes.error,
  codeTypes.warn,
  codeTypes.info,
];

export const setAllowedTypes = (types: CodeType[]): void => {
  if (Array.isArray(types)) {
    allowedTypes = types;
  }
};

const SERVICE_NAME = "ui-components";
const loggerManager = __logger(SERVICE_NAME);

interface LogEntry {
  message: string;
  context?: any;
  code?: string;
}

interface ErrorLogEntry extends LogEntry {
  error?: any;
}

export const getTrackingCode = (codeType: CodeType, code: string): string =>
  getTrackingCodeHelper(SERVICE_NAME, codeType, code);

const logWrapper =
  (logFn: (entry: LogEntry) => void, type: CodeType) =>
  ({ message, context = null, code = "NA-LOGGER" }: LogEntry) => {
    if (!allowedTypes.includes(type)) return;

    const formattedCode = getTrackingCode(type, code);
    logFn({ message, context, code: formattedCode });
  };

const errorLogWrapper =
  (logFn: (entry: ErrorLogEntry) => void, type: CodeType) =>
  ({ message, error, context = null, code = "NA-LOGGER" }: ErrorLogEntry) => {
    if (!allowedTypes.includes(type)) return;

    logFn({ error, message, context, code: getTrackingCode(type, code) });
  };

export const logger = {
  info: logWrapper(loggerManager.info, codeTypes.info),
  warn: logWrapper(loggerManager.warn, codeTypes.warn),
  verbose: logWrapper(loggerManager.verbose, codeTypes.verbose),
  debug: logWrapper(loggerManager.debug, codeTypes.debug),
  silly: logWrapper(loggerManager.silly, codeTypes.silly),
  error: errorLogWrapper(loggerManager.error, codeTypes.error),
};
