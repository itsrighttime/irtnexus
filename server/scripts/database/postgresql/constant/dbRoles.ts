import { DB_ENV } from "#configs";
import { DbUserCredential } from "../types/database";

export const DB_USER_PASS: Record<string, DbUserCredential> = {
  AUDIT: {
    USER: "dev_audit_user",
    PASS: DB_ENV.DB_AUDIT_USER_PASS,
  },
  OP: {
    USER: "dev_op_user",
    PASS: DB_ENV.DB_OP_USER_PASS,
  },
  REPORT: {
    USER: "dev_report_user",
    PASS: DB_ENV.DB_REPORT_USER_PASS,
  },
  BILLING: {
    USER: "dev_billing_user",
    PASS: DB_ENV.DB_BILLING_USER_PASS,
  },
  ADMIN: {
    USER: "dev_admin_user",
    PASS: DB_ENV.DB_ADMIN_USER_PASS,
  },
  INTEGRATION: {
    USER: "dev_integration_user",
    PASS: DB_ENV.DB_INTEGRATION_USER_PASS,
  },
  READONLY_SENS: {
    USER: "dev_readonly_user",
    PASS: DB_ENV.DB_READONLY_SENSITIVE_PASS,
  },
};
