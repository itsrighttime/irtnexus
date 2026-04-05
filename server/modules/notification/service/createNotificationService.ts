import { NotificationService } from "./NotificationService";
import { NotificationDispatcher } from "./NotificationDispatcher";
import { NotificationPreferenceService } from "./NotificationPreferenceService";
import { NotificationTemplateService } from "./NotificationTemplateService";
import { NotificationTrackingService } from "./NotificationTrackingService";
import { NotificationScheduler } from "./NotificationScheduler";

import { EventBus } from "#packages/event-bus";

/**
 * Factory to create NotificationService instance
 */
export const createNotificationService = (redisUrl: string) => {
  // Core services
  const eventBus = new EventBus(redisUrl);
  const templateService = new NotificationTemplateService();
  const preferenceService = new NotificationPreferenceService();
  const trackingService = new NotificationTrackingService();
  const scheduler = new NotificationScheduler(eventBus);

  // Infra
  const dispatcher = new NotificationDispatcher(eventBus);

  // Main service
  const notificationService = new NotificationService(
    templateService,
    preferenceService,
    dispatcher,
    scheduler,
    trackingService,
  );

  return {
    notificationService,
    templateService,
    preferenceService,
    trackingService,
    scheduler,
    dispatcher,
  };
};
