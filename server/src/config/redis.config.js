import Redis from "ioredis";
import { UtilsError } from "../packages/index.js";
import { logger } from "#utils";

const { handleError } = UtilsError;

/**
 * Redis Client Instance
 *
 * Configured using ioredis with support for:
 * - Lazy connection (connect explicitly during app bootstrap)
 * - Automatic retries with exponential backoff
 * - Reconnect on specific errors (network issues, READONLY errors)
 * - Connection identification via `connectionName` for monitoring
 */
export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1", // Redis host
  port: Number(process.env.REDIS_PORT) || 6379, // Redis port
  password: process.env.REDIS_PASSWORD || undefined, // Optional password

  // Recommended for production: delays connection until explicitly connected
  lazyConnect: true,
  enableReadyCheck: true,

  // Identifier for monitoring and logs
  connectionName: "irtnexus",
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,

  /**
   * Retry Strategy
   *
   * Attempts reconnection with increasing delays (up to 2 seconds)
   * Logs each reconnect attempt using fileLogger
   */
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000); // exponential backoff capped at 2s
    fileLogger.warn({
      message: "Redis reconnect attempt",
      attempt: times,
      delay,
      code: "00011",
    });
    return delay;
  },

  /**
   * Reconnect on Error
   *
   * Returns true to reconnect automatically on specific errors
   */
  reconnectOnError(err) {
    const targetErrors = ["READONLY", "ECONNRESET", "ETIMEDOUT"];
    if (targetErrors.some((e) => err.message.includes(e))) {
      return true;
    }
    return false;
  },
});

/**
 * Explicitly connect to Redis during application bootstrap
 *
 * Ensures that Redis is available before starting the server
 */
export const connectRedis = async () => {
  try {
    await redis.connect();
    logger.info({
      message: "Connected to Redis",
      code: "00010",
    });
  } catch (error) {
    handleError(error, {
      code: "0000F",
      isTrusted: false, // Redis is critical for OTP/Auth, treat failure as fatal
    });
  }
};

/**
 * Redis error event listener
 *
 * Logs Redis errors using the centralized logger
 */
redis.on("error", (error) => {
  logger.error(`message: "Redis error", code: "00012"`);
  logger.error(error);
});
