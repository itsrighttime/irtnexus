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
} as const;

const TYPE_CODES = {
  error: "ER",
  info: "IN",
  debug: "DE",
  warning: "WA",
  verbose: "VE",
  silly: "SI",
} as const;

type CompanyName = keyof typeof COMPANY_CODES;
type CodeType = keyof typeof TYPE_CODES;

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
export const getTrackingCode = (
  companyName: CompanyName | string,
  codeType: CodeType | string,
  unique: string,
): string => {
  if (!companyName || !codeType || !unique) {
    throw new Error(
      `All parameters must be present for generating tracking code.`,
    );
  }

  const companyCode = COMPANY_CODES[companyName as CompanyName] || companyName;
  const typeCode = TYPE_CODES[codeType as CodeType] || codeType;

  return `${companyCode}-${typeCode}-${unique}`;
};
