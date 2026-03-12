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

// Read replica pool
export const replicaPool = new Pool({
  ...DB_MAIN_CONFIG,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

replicaPool.on("error", (err) => {
  console.error("Unexpected error on replica pool", err);
});
