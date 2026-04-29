import { DB_ENV } from "#configs";

export const DATABASES_TABLE_FOLDERS = [
  {
    name: DB_ENV.DB_NAME,
    folders: [
      "00_formost",
      "01_core",
      "02_identity",
      "03_auth",
      "04_audit",
      "05_notification",
      "06_partner",
    ],
  },
  // { name: process.env.REPORT_DB_NAME, folders: ["01_reporting"] }, // Optional reporting database
];
