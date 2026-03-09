import { DB_ENV } from "#config";

export const DATABASES_TABLE_FOLDERS = [
  {
    name: DB_ENV.DB_NAME,
    folders: [
      "00_formost",
      "01_org",
      "02_user",
      "03_audit",
      "04_subs",
      "05_erp",
    ],
  },
  // { name: process.env.REPORT_DB_NAME, folders: ["01_reporting"] }, // Optional reporting database
];
