export { apiCaller } from "./apiCaller";
export { fromKebabCase, toKebabCase } from "./caseConverter";
export { BRAND_COLORS, getColorCode } from "./COLOR";
export { delay } from "./delay";
export { redirectUrlWithBack } from "./redirectToUrl";
export { redirectURL } from "./redirectURL";
export { setDocumentTitle } from "./setDocumentTitle";

import { UtilsLogger } from "./logger/logger.util";

export const logger = UtilsLogger.logger;
export const codeTypes = UtilsLogger.codeTypes;
export const getTrackingCode = UtilsLogger.getTrackingCode;
export const setAllowedTypes = UtilsLogger.setAllowedTypes;
