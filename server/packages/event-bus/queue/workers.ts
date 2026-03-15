import { Worker } from "bullmq";
import { BaseEvent } from "../types/event";
import { connectionToRedis, eventQueue } from "./bullmq-queues";

// Worker to process asynchronous jobs emitted from the EventBus
export const eventWorker = new Worker(
  "eventJobs",
  async (job) => {
    const event: BaseEvent = job.data;
    console.log(
      `[Worker] Processing event ${event.eventType} for tenant ${event.tenantId}`,
    );

    // Example: handle specific events
    switch (event.eventType) {
      case "PayrollProcessed":
        // Call payroll microservice logic
        console.log("Running payroll calculations for", event.payload);
        break;
      case "CommissionCalculated":
        // Trigger finance commission logic
        console.log("Processing commission for", event.payload);
        break;
      case "NotificationCreated":
        // Trigger email/notification service
        console.log("Sending notification to", event.payload);
        break;
      default:
        console.log("No handler for this event, skipping.");
    }

    return { success: true };
  },
  { connection: connectionToRedis }, // same Redis connection
);
eventWorker.on("completed", (job) => {
  if (!job) return;
  console.log(`[Worker] Job completed: ${job.id}`);
});

eventWorker.on("failed", (job, err) => {
  if (!job) return;
  console.error(`[Worker] Job failed: ${job?.id}`, err);
});
