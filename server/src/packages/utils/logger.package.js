import {
  createLoggerManager,
  getTrackingCode as getTrackingCodeHelper,
  loggerMessageFormater,
} from "@itsrighttime/utils";

import dotenv from "dotenv";
dotenv.config();

const allowedTypes = process.env.LOG_TYPES?.split(",") || ["error", "warn"];

// Initialize a single logger manager instance for the product
const loggerManager = createLoggerManager("irt-dev");

// ----------- UTILITY METHODS -----------

const getTrackingCode = (codeType, code) =>
  getTrackingCodeHelper("irt-dev", codeType, code);

// ----------- LOG WRAPPER -----------

const logWrapper = (logFn, type) => {
  return ({ message, context = null, code = "NA" }) => {
    const formatedCode = getTrackingCode(type, code);

    if (allowedTypes.includes(type)) {
      logFn({ message, context, code: formatedCode });
    }
  };
};

const errorLogWrapper = (logFn, type) => {
  return (error) => {
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
};

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

const createFolderLogger = (folderName, fileName) => {
  const rawFolderLogger = loggerManager.folderLogger(
    `irt-dev/${folderName}`,
    fileName
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

const { getTrackingCode, fileLogger, codeTypes } = UtilsLogger;

*/
