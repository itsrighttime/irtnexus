import { DB_ENV as ENV } from "#configs";
import { logger } from "#packages/utils/logger.util.js";
import { Pool } from "pg";

const DB_MAIN_CONFIG = {
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  database: ENV.DB_NAME,
  user: ENV.DB_USER,
  password: ENV.DB_PASS,
  max: 10,
  idleTimeoutMillis: 30000, // optional: release idle clients
  connectionTimeoutMillis: 5000, // fail after 5 seconds
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
  logger.error("Unexpected error on replica pool", err);
});

export const testDB = async () => {
  const client = await pool.connect();
  logger.info("Pool connection succeeded!");
  await client.query("SELECT 1");
  client.release();
};
