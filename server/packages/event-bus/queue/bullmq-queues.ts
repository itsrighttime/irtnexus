import { redisOptions as RO } from "#configs/redis.config.js";
import { logger } from "#utils";
import { Queue } from "bullmq";

export const connectionToRedis = {
  port: RO.port,
  host: RO.host,
  password: RO.password,
  lazyConnect: RO.lazyConnect,
  enableReadyCheck: RO.enableReadyCheck,
  connectionName: RO.connectionName,
  maxRetriesPerRequest: RO.maxRetriesPerRequest,
  enableOfflineQueue: RO.enableOfflineQueue,
  retryStrategy: RO.retryStrategy,
  reconnectOnError: RO.reconnectOnError,
};

// Main queue for async event processing
export const eventQueue = new Queue("eventJobs", {
  connection: connectionToRedis,
  defaultJobOptions: {
    removeOnComplete: true, // auto-remove completed jobs
    removeOnFail: false, // keep failed jobs for debugging
    attempts: 3, // retries
    backoff: { type: "exponential", delay: 1000 }, // exponential retry
  },
});

logger.info("BullMQ Event Queue initialized (v5)");
