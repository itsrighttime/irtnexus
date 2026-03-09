import { TABLES } from "./dbTables";

function withHistory(tables: string[]): string[] {
  return tables.flatMap((t) => [t, `history_${t}`]);
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
    ]),
  ],

  OP: [
    ...TABLES.USERS,
    ...TABLES.AUTH,
    ...TABLES.CONTACTS,
    ...TABLES.TENANTS,
    ...TABLES.SUBS,
  ],

  REPORT: ["*"],

  BILLING: ["users"],

  ADMIN: ["*"],

  INTEGRATION: ["users"],

  READONLY_SENS: ["users"],
};
