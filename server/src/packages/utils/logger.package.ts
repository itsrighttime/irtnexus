import {
  createLoggerManager,
  getTrackingCode as getTrackingCodeHelper,
  loggerMessageFormater,
} from "@itsrighttime/utils";
import dotenv from "dotenv";

dotenv.config();

const allowedTypes: string[] = process.env.LOG_TYPES?.split(",") || [
  "error",
  "warn",
];

// Initialize a single logger manager instance for the product
const loggerManager = createLoggerManager("irtnexus");

// ----------- UTILITY METHODS -----------

const getTrackingCode = (codeType: string, code: string): string =>
  getTrackingCodeHelper("irtnexus", codeType, code);

// ----------- LOG WRAPPER -----------

interface LogWrapperParams {
  message: string;
  context?: Record<string, any> | null;
  code?: string;
}

type LogFunction = (params: LogWrapperParams) => void;

const logWrapper = (logFn: LogFunction, type: string) => {
  return ({ message, context = null, code = "NA" }: LogWrapperParams) => {
    const formatedCode = getTrackingCode(type, code);

    if (allowedTypes.includes(type)) {
      logFn({ message, context, code: formatedCode });
    }
  };
};

const errorLogWrapper = (logFn: (error: any) => void, type: string) => {
  return (error: any) => {
    if (allowedTypes.includes(type)) {
      logFn(error);
    }
  };
};

// ----------- Tracking Code Types -----------

const codeTypes = {
  info: "info",
  error: "error",
  warn: "warn",
  verbose: "verbose",
  debug: "debug",
  silly: "silly",
} as const;

type CodeType = keyof typeof codeTypes;

// ----------- FILE LOGGER -----------

const rawFileLogger = loggerManager.logger;

const fileLogger = {
  info: logWrapper(rawFileLogger.info, codeTypes.info),
  warn: logWrapper(rawFileLogger.warn, codeTypes.warn),
  verbose: logWrapper(rawFileLogger.verbose, codeTypes.verbose),
  debug: logWrapper(rawFileLogger.debug, codeTypes.debug),
  silly: logWrapper(rawFileLogger.silly, codeTypes.silly),
  error: errorLogWrapper(rawFileLogger.error, codeTypes.error),
};

// ----------- FOLDER LOGGER -----------

const createFolderLogger = (folderName: string, fileName: string) => {
  const rawFolderLogger = loggerManager.folderLogger(
    `irtnexus/${folderName}`,
    fileName,
  );

  return {
    info: logWrapper(rawFolderLogger.info, codeTypes.info),
    warn: logWrapper(rawFolderLogger.warn, codeTypes.warn),
    verbose: logWrapper(rawFolderLogger.verbose, codeTypes.verbose),
    debug: logWrapper(rawFolderLogger.debug, codeTypes.debug),
    silly: logWrapper(rawFolderLogger.silly, codeTypes.silly),
    error: errorLogWrapper(rawFolderLogger.error, codeTypes.error),
  };
};

// ----------- EXPORT UTILS LOGGER -----------

export const UtilsLogger = {
  fileLogger,
  codeTypes,
  createFolderLogger,
  createLoggerManager,
  getTrackingCode,
  loggerMessageFormater,
};

/*
Usage:

const { getTrackingCode, fileLogger, codeTypes } = UtilsLogger;
*/
