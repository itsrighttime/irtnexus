import { eventBus } from "#modules/bootstrap";
import { createNotificationService } from "./createNotificationService";

export const { notificationService, scheduler, dispatcher } =
  createNotificationService(eventBus);
