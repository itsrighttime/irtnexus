import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * MySQL Connection Pool
 *
 * Uses mysql2/promise for async/await queries.
 * Connection pooling improves performance by reusing existing connections.
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST, // Database host
  user: process.env.DB_USER, // Database username
  password: process.env.DB_PASS, // Database password
  database: process.env.DB_NAME, // Default database
  waitForConnections: true, // Queue connection requests if all connections are in use
  connectionLimit: 10, // Maximum number of simultaneous connections
});

export const DB_GLOBAL = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
};

/**
 * Database User Passwords
 *
 * Stores passwords for different database roles.
 * Useful for role-based access control when connecting to the database with different privileges.
 */
export const DB_USER_PASS = {
  AUDIT: { PASS: process.env.DB_AUDIT_USER_PASS, USER: "ls_audit_user" },
  OP: { PASS: process.env.DB_OP_USER_PASS, USER: "ls_op_user" },
  REPORT: { PASS: process.env.DB_REPORT_USER_PASS, USER: "ls_report_user" },
  BILLING: { PASS: process.env.DB_BILLING_USER_PASS, USER: "ls_billing_user" },
  ADMIN: { PASS: process.env.DB_ADMIN_USER_PASS, USER: "ls_admin_user" },
  INTEGRATION: {
    PASS: process.env.DB_INTEGRATION_USER_PASS,
    USER: "ls_integration_user",
  },
  READONLY_SENSI: {
    PASS: process.env.DB_READONLY_SENSITIVE_PASS,
    USER: "ls_readonly_user",
  },
};

/**
 * Mapping of database users to allowed tables
 *
 * Defines which tables each user role can access.
 * This helps implement row-level or table-level access control in the application.
 */
export const DB_TABLES_USER_MAP = {
  AUDIT: [
    "audit_logs",
    // "security_events" // Uncomment if needed
  ],
  OP: [
    "users",
    "user_names",
    "user_emails",
    "user_phones",
    "user_addresses",
    "auth_credentials",
    "user_keys",
    "entities",
    "entity_relationships",
  ],
  REPORT: ["*"], // Access to all tables
  BILLING: [
    // "wallets", "invoices", "transactions", "billing_accounts"
    "users",
  ],
  ADMIN: ["*"], // Full access
  INTEGRATION: [
    "users",
    // "users", "sessions", "transactions", "audit_logs" // Add as needed
  ],
  READONLY_SENS: [
    "users",
    // "auth_credentials", "user_keys" // Sensitive read-only tables
  ],
};

/**
 * Database-to-folder configuration
 *
 * Defines which folders correspond to which databases.
 * Useful for organizing SQL scripts, migrations, or seed data.
 */
export const DATABASES_TABLE_FOLDERS = [
  { name: process.env.DB_NAME, folders: ["01_user", "02_audit", "03_org"] },
  // { name: process.env.REPORT_DB_NAME, folders: ["01_reporting"] }, // Optional reporting database
];
