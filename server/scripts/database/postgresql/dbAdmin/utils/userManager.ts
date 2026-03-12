import { pgPool } from "../../config/postgres.pool.js";
import { logger } from "#utils";

export async function createUser(
  user: { username: string; password: string },
  plan = false,
) {
  const sql = `
      DO
      $$
      BEGIN
         IF NOT EXISTS (
            SELECT FROM pg_catalog.pg_roles WHERE rolname = '${user.username}'
         ) THEN
            CREATE ROLE "${user.username}" LOGIN PASSWORD '${user.password}';
         END IF;
      END
      $$;
    `;

  if (plan) {
    logger.info(`[PLAN] ${sql}`);
    return;
  }

  await pgPool.query(sql);

  logger.info(`User ensured: ${user.username}`);
}

export async function dropUser(user: { username: string }, plan = false) {
  const sql = `DROP ROLE IF EXISTS "${user.username}"`;

  if (plan) {
    logger.warn(`[PLAN] ${sql}`);
    return;
  }

  await pgPool.query(sql);

  logger.warn(`User dropped: ${user.username}`);
}
