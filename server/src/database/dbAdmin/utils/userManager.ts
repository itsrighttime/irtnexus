import { pgPool } from "#database/config/postgres.pool.js";
import { logger } from "#utils";

export async function createUser(
  user: { username: string; password: string },
  plan = false,
) {
  const sql = `CREATE ROLE "${user.username}" LOGIN PASSWORD $1`;

  if (plan) {
    logger.info(`[PLAN] ${sql}`);
    return;
  }

  await pgPool.query(sql, [user.password]);

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
