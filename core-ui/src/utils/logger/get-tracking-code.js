const COMPANY_CODES = {
    itsRIGHTtime: "RIGH",
    letsDiscuss: "DISC",
    letsCreate: "CREA",
    letsCollaborate: "COLL",
    letsSchedule: "SCHE",
    CREATIVE: "CRTI",
    letsSecure: "SECU",
    utils: "UTIL",
    brodcast: "BROD",
    "ui-components": "COMP",
};
const TYPE_CODES = {
    error: "ER",
    info: "IN",
    debug: "DE",
    warning: "WA",
    verbose: "VE",
    silly: "SI",
};
/**
 * Generates a tracking code string in the format:
 * COMPANYCODE-TYPECODE-UNIQUE
 *
 * @param companyName - Company identifier (must be one of COMPANY_CODES keys)
 * @param codeType - Type identifier (must be one of TYPE_CODES keys)
 * @param unique - Unique string for this event
 *
 * @returns Tracking code string
 *
 * @throws Error if any parameter is missing
 */
export const getTrackingCode = (companyName, codeType, unique) => {
    if (!companyName || !codeType || !unique) {
        throw new Error(`All parameters must be present for generating tracking code.`);
    }
    const companyCode = COMPANY_CODES[companyName] || companyName;
    const typeCode = TYPE_CODES[codeType] || codeType;
    return `${companyCode}-${typeCode}-${unique}`;
};
