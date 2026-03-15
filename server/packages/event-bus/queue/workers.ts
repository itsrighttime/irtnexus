import { Worker } from "bullmq";
import { BaseEvent } from "../types/event";
import { connectionToRedis, eventQueue } from "./bullmq-queues";
import { logger } from "#utils";

// Worker to process asynchronous jobs emitted from the EventBus
export const eventWorker = new Worker(
  "eventJobs",
  async (job) => {
    const event: BaseEvent = job.data;
    logger.debug(
      `[Worker] Processing event ${event.eventType} for tenant ${event.tenantId}`,
    );

    // Example: handle specific events
    switch (event.eventType) {
      case "PayrollProcessed":
        // Call payroll microservice logic
        logger.debug("[Worker] Running payroll calculations for", event.payload);
        break;
      case "CommissionCalculated":
        // Trigger finance commission logic
        logger.debug("[Worker] Processing commission for", event.payload);
        break;
      case "NotificationCreated":
        // Trigger email/notification service
        logger.debug("[Worker] Sending notification to", event.payload);
        break;
      default:
        logger.debug("[Worker] No handler for this event, skipping.");
    }

    return { success: true };
  },
  { connection: connectionToRedis }, // same Redis connection
);
eventWorker.on("completed", (job) => {
  if (!job) return;
  logger.debug(`[Worker] Job completed: ${job.id}`);
});

eventWorker.on("failed", (job, err) => {
  if (!job) return;
  console.error(`[Worker] Job failed: ${job?.id}`, err);
});
