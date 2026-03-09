import { pgPool } from "#database/config/postgres.pool.js";
import { logger } from "#utils";

export async function rotatePassword(
  user: {
    username: string;
    password?: string;
    rotatePassword?: boolean;
  },
  plan = false,
) {
  if (!user.rotatePassword || !user.password) return;

  const sql = `ALTER ROLE "${user.username}" WITH PASSWORD $1`;

  if (plan) {
    logger.info(`[PLAN] Rotate password for ${user.username}`);
    return;
  }

  await pgPool.query(sql, [user.password]);

  logger.info(`Password rotated for ${user.username}`);
}
