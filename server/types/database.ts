export type DbRole =
  | "AUDIT"
  | "OP"
  | "REPORT"
  | "BILLING"
  | "ADMIN"
  | "INTEGRATION"
  | "READONLY_SENS";

export interface DbUserCredential {
  USER: string;
  PASS: string;
}

export type TableName = string;
