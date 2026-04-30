import { TABLES } from "./dbTables";

function withHistory(tables: string[]): string[] {
  return tables.flatMap((t) => [t, `${t}_versions`]);
}

export const DB_TABLES_USER_MAP = {
  AUDIT: [
    ...TABLES.AUDIT,
    ...withHistory([
      ...TABLES.USERS,
      ...TABLES.AUTH,
      ...TABLES.CONTACTS,
      ...TABLES.TENANTS,
      ...TABLES.SUBS,
      ...TABLES.NOTIFICATION,
      ...TABLES.PARTNER,
      ...TABLES.FORM,
    ]),
  ],

  OP: [
    ...TABLES.USERS,
    ...TABLES.AUTH,
    ...TABLES.CONTACTS,
    ...TABLES.TENANTS,
    ...TABLES.SUBS,
    ...TABLES.NOTIFICATION,
    ...TABLES.PARTNER,
    ...TABLES.FORM,
  ],

  REPORT: ["*"],

  BILLING: ["accounts"],

  ADMIN: ["*"],

  INTEGRATION: ["accounts"],

  READONLY_SENS: ["accounts"],
};
