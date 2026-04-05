import { Notification, Recipient } from "../types";
import { EventBus, BaseEvent } from "#packages/event-bus";

export class NotificationScheduler {
  constructor(private eventBus: EventBus) {}

  /**
   * Schedule a notification to be sent at a future date/time
   * @param notification Notification object
   * @param recipients List of recipients
   * @param sendAt Date when notification should be sent
   */
  async schedule(
    notification: Notification,
    recipients: Recipient[],
    sendAt: Date,
  ): Promise<void> {
    const delay = sendAt.getTime() - Date.now();
    if (delay <= 0) {
      // If scheduled time is in the past or now, send immediately
      await this.eventBus.publish({
        eventType: "NOTIFICATION_SCHEDULED",
        tenantId: notification.tenant_id,
        payload: { notification, recipients },
      });
      return;
    }

    // Use event bus delayed publishing
    await this.eventBus.publishDelayed( // iRt#32$Dan
      {
        eventType: "NOTIFICATION_SCHEDULED",
        tenantId: notification.tenant_id,
        payload: { notification, recipients },
      },
      delay,
    );
  }

  /**
   * Handles scheduled notifications (called by event bus)
   */
  async handleScheduledEvent(event: BaseEvent): Promise<void> {
    const { notification, recipients } = event.payload;

    if (!notification || !recipients?.length) return;

    // Re-publish to actual dispatcher channels
    await this.eventBus.publish({
      eventType: "NOTIFICATION_DISPATCH",
      tenantId: notification.tenantId,
      payload: { notification, recipients },
    });
  }
}
