import dotenv from "dotenv";
dotenv.config();

export const DB_ENV = {
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || "",
  DB_USER: process.env.DB_USER || "",
  DB_PASS: process.env.DB_PASS || "",

  DB_AUDIT_USER: process.env.DB_USER || "",
  DB_OP_USER: process.env.DB_OP_USER || "",
  DB_REPORT_USER: process.env.DB_REPORT_USER || "",
  DB_BILLING_USER: process.env.DB_BILLING_USER || "",
  DB_ADMIN_USER: process.env.DB_ADMIN_USER || "",
  DB_INTEGRATION_USER: process.env.DB_INTEGRATION_USER || "",
  DB_READONLY_SENSITIVE: process.env.DB_READONLY_SENSITIVE || "",

  DB_AUDIT_USER_PASS: process.env.DB_PASS || "",
  DB_OP_USER_PASS: process.env.DB_OP_USER_PASS || "",
  DB_REPORT_USER_PASS: process.env.DB_REPORT_USER_PASS || "",
  DB_BILLING_USER_PASS: process.env.DB_BILLING_USER_PASS || "",
  DB_ADMIN_USER_PASS: process.env.DB_ADMIN_USER_PASS || "",
  DB_INTEGRATION_USER_PASS: process.env.DB_INTEGRATION_USER_PASS || "",
  DB_READONLY_SENSITIVE_PASS: process.env.DB_READONLY_SENSITIVE_PASS || "",
};

export const DB_GLOBAL = {
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "",
};
