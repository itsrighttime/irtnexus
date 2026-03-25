import { DB_GLOBAL } from "#config";
import { DB_USER_PASS } from "#database/constant/dbRoles.js";
import { DB_TABLES_USER_MAP as TABLE_MAP } from "#database/constant/tablePermissions.js";

// import { DB_GLOBAL, DB_USER_PASS, DB_TABLES_USER_MAP } from "#config";

export type DbAction = "SELECT" | "INSERT" | "UPDATE" | "DELETE";

export interface DbPrivilege {
  db: string;
  tables: string[];
  actions: DbAction[];
}

export interface DbUserConfig {
  username: string;
  host: string;
  password: string;
  rotatePassword: boolean;
  privileges: DbPrivilege[];
  drop?: boolean;
}

export const DB_USERS: DbUserConfig[] = [
  // --- Audit User: immutable writes ---
  {
    username: DB_USER_PASS.AUDIT.USER,
    host: DB_GLOBAL.host,
    password: DB_USER_PASS.AUDIT.PASS,
    rotatePassword: false,
    privileges: [
      {
        db: DB_GLOBAL.database,
        tables: TABLE_MAP.AUDIT,
        actions: ["INSERT", "SELECT"], // only append
      },
    ],
  },

  // --- Operational User: core transactional operations ---
  {
    username: DB_USER_PASS.OP.USER,
    host: DB_GLOBAL.host,
    password: DB_USER_PASS.OP.PASS,
    rotatePassword: true,
    privileges: [
      {
        db: DB_GLOBAL.database,
        tables: TABLE_MAP.OP,
        actions: ["INSERT", "SELECT", "UPDATE", "DELETE"],
      },
    ],
  },

  // --- Reporting User: read-only, heavy read pool ---
  {
    username: DB_USER_PASS.REPORT.USER,
    host: DB_GLOBAL.host,
    password: DB_USER_PASS.REPORT.PASS,
    rotatePassword: true,
    privileges: [
      {
        db: "reporting_db",
        tables: TABLE_MAP.REPORT, // all tables in reporting DB
        actions: ["SELECT"],
      },
    ],
  },

  // --- Billing User: sensitive financial data ---
  {
    username: DB_USER_PASS.BILLING.USER,
    host: DB_GLOBAL.host,
    password: DB_USER_PASS.BILLING.PASS,
    rotatePassword: true,
    privileges: [
      {
        db: DB_GLOBAL.database,
        tables: TABLE_MAP.BILLING,
        actions: ["SELECT", "INSERT", "UPDATE"],
      },
    ],
  },

  // --- Admin User: full access, used rarely ---
  {
    username: DB_USER_PASS.ADMIN.USER,
    host: DB_GLOBAL.host,
    password: DB_USER_PASS.ADMIN.PASS,
    rotatePassword: false,
    privileges: [
      {
        db: DB_GLOBAL.database,
        tables: TABLE_MAP.ADMIN,
        actions: ["INSERT", "SELECT", "UPDATE", "DELETE"],
      },
    ],
  },

  // --- Integration / Service Account ---
  {
    username: DB_USER_PASS.INTEGRATION.USER,
    host: DB_GLOBAL.host,
    password: DB_USER_PASS.INTEGRATION.PASS,
    rotatePassword: true,
    privileges: [
      {
        db: DB_GLOBAL.database,
        tables: TABLE_MAP.INTEGRATION,
        actions: ["SELECT", "INSERT", "UPDATE"],
      },
    ],
  },

  // --- Sensitive Read-Only ---
  {
    username: DB_USER_PASS.READONLY_SENS.USER,
    host: DB_GLOBAL.host,
    password: DB_USER_PASS.READONLY_SENS.PASS,
    rotatePassword: true,
    privileges: [
      {
        db: DB_GLOBAL.database,
        tables: TABLE_MAP.READONLY_SENS,
        actions: ["SELECT"],
      },
    ],
  },
];
