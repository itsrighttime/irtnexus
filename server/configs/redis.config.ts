// src/database/redis.ts
import Redis, { RedisOptions } from "ioredis";
import { UtilsError } from "#packages";
import { logger } from "#utils";

const { handleError } = UtilsError;

/**
 * Redis configuration options
 */
const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,

  // Lazy connect until explicitly called
  lazyConnect: true,
  enableReadyCheck: true,
  connectionName: "irtnexus",
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,

  // Retry strategy with exponential backoff capped at 2s
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    logger.warn("Redis reconnect attempt", { attempt: times, delay }, "00011");
    return delay;
  },

  // Reconnect automatically on specific errors
  reconnectOnError(err: Error) {
    const targetErrors = ["READONLY", "ECONNRESET", "ETIMEDOUT"];
    if (targetErrors.some((e) => err.message.includes(e))) return true;
    return false;
  },
};

/**
 * Redis client instance
 */
export const redis = new Redis(redisOptions);

/**
 * Explicitly connect to Redis
 */
export const connectRedis = async (): Promise<void> => {
  try {
    await redis.connect();
    logger.info("Connected to Redis", {}, "00010");
  } catch (error: any) {
    handleError(error, {
      code: "0000F",
      isTrusted: false, // Redis is critical
    });
  }
};

/**
 * Redis error listener
 */
redis.on("error", (error: Error) => {
  logger.error({
    message: "Redis error",
    code: "00012",
  });
  logger.error(error);
});

/**
 * Graceful Redis shutdown
 */
export const disconnectRedis = async (): Promise<void> => {
  try {
    await redis.quit();
    logger.info("Redis connection closed", {}, "00013");
  } catch (error) {
    logger.error({
      message: "Error while disconnecting Redis",
      code: "00014",
    });
    logger.error(error);
  }
};
