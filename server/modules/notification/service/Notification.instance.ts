import { redisUrl } from "#configs";
import { createNotificationService } from "./createNotificationService";

export const { notificationService, scheduler, dispatcher } =
  createNotificationService(redisUrl);
