import { DB_ENV as ENV } from "#config";
import { Pool } from "pg";

const DB_MAIN_CONFIG = {
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  database: ENV.DB_NAME,
  user: ENV.DB_USER,
  password: ENV.DB_PASS,
  max: 10,
};

export const pool = new Pool(DB_MAIN_CONFIG);
