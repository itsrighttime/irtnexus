import { getTrackingCode as getTrackingCodeHelper } from "./get-tracking-code.js";
import { __logger } from "./helper/logger.helper.js";
export const codeTypes = {
    info: "info",
    error: "error",
    warn: "warn",
    verbose: "verbose",
    debug: "debug",
    silly: "silly",
};
let allowedTypes = [
    codeTypes.error,
    codeTypes.warn,
    codeTypes.info,
];
export const setAllowedTypes = (types) => {
    if (Array.isArray(types)) {
        allowedTypes = types;
    }
};
const SERVICE_NAME = "ui-components";
const loggerManager = __logger(SERVICE_NAME);
export const getTrackingCode = (codeType, code) => getTrackingCodeHelper(SERVICE_NAME, codeType, code);
const logWrapper = (logFn, type) => ({ message, context = null, code = "NA-LOGGER" }) => {
    if (!allowedTypes.includes(type))
        return;
    const formattedCode = getTrackingCode(type, code);
    logFn({ message, context, code: formattedCode });
};
const errorLogWrapper = (logFn, type) => ({ message, error, context = null, code = "NA-LOGGER" }) => {
    if (!allowedTypes.includes(type))
        return;
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
