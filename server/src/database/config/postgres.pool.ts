import { DB_ENV as ENV } from "#config";
import { Pool } from "pg";

export const pgPool = new Pool({
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  database: ENV.DB_NAME,
  user: ENV.DB_USER,
  password: ENV.DB_PASS,
  max: 10,
});
export const defaultPool = new Pool({
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  database: "postgres",
  user: ENV.DB_USER,
  password: ENV.DB_PASS,
  max: 10,
});
