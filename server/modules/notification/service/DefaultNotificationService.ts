import { BaseEvent, EventBus } from "#packages/event-bus";
import { generateUUID } from "#packages/utils";
import {
  Notification,
  NotificationChannel,
  NotificationPreferences,
  Recipient,
} from "../types/NotificationService";

export class DefaultNotificationService {
  constructor(
    private readonly eventBus: EventBus,
    private readonly preferenceRepo: NotificationPreferenceRepository,
    private readonly notificationRepo: NotificationRepository,
  ) {}

  // -----------------------------
  // Entry point
  // -----------------------------
  async handleEvent(event: BaseEvent): Promise<void> {
    const notification = await this.buildNotification(event);
    if (!notification) return;

    const recipients = await this.resolveRecipients(event);
    if (!recipients.length) return;

    await this.dispatch(notification, recipients);
  }

  // -----------------------------
  // Build notification
  // -----------------------------
  async buildNotification(event: BaseEvent): Promise<Notification | null> {
    switch (event.eventType) {
      case "MESSAGE_SENT":
        return {
          id: generateUUID(),
          type: "NEW_MESSAGE",
          title: "New Message",
          body: event.payload.text,
          data: event.payload,
          tenantId: event.tenantId,
          createdAt: new Date(),
        };

      case "ORDER_PLACED":
        return {
          id: generateUUID(),
          type: "ORDER_CONFIRMATION",
          title: "Order Confirmed",
          body: "Your order has been placed successfully",
          data: event.payload,
          tenantId: event.tenantId,
          createdAt: new Date(),
        };

      default:
        return null;
    }
  }

  // -----------------------------
  // Resolve recipients
  // -----------------------------
  async resolveRecipients(event: BaseEvent): Promise<Recipient[]> {
    // Simple example — extend later
    if (event.payload?.userId) {
      return [
        {
          userId: event.payload.userId,
          email: event.payload.email,
          phone: event.payload.phone,
        },
      ];
    }

    return [];
  }

  // -----------------------------
  // Resolve channels
  // -----------------------------
  async resolveChannels(
    recipient: Recipient,
    notification: Notification,
  ): Promise<NotificationChannel[]> {
    const prefs = await this.preferenceRepo.get(recipient.userId);

    if (!prefs) {
      return ["IN_APP"]; // default fallback
    }

    return (Object.keys(prefs.channels) as NotificationChannel[])
      .filter((channel) => prefs.channels[channel])
      .filter((channel) => !prefs.mutedTypes?.includes(notification.type));
  }

  // -----------------------------
  // Dispatch (fan-out)
  // -----------------------------
  async dispatch(
    notification: Notification,
    recipients: Recipient[],
  ): Promise<void> {
    // Persist first
    await this.notificationRepo.create(notification);

    for (const recipient of recipients) {
      const channels = await this.resolveChannels(recipient, notification);

      for (const channel of channels) {
        await this.dispatchToChannel(notification, recipient, channel);
      }
    }
  }

  // -----------------------------
  // Channel dispatch via EventBus
  // -----------------------------
  async dispatchToChannel(
    notification: Notification,
    recipient: Recipient,
    channel: NotificationChannel,
  ): Promise<void> {
    await this.eventBus.publish({
      eventType: `NOTIFICATION_${channel}_SEND`,
      tenantId: notification.tenantId,
      payload: {
        notification,
        recipient,
      },
    });
  }

  // -----------------------------
  // Scheduling
  // -----------------------------
  async schedule(
    notification: Notification,
    recipients: Recipient[],
    sendAt: Date,
  ): Promise<void> {
    const delay = sendAt.getTime() - Date.now();

    await this.eventBus.publishDelayed(
      {
        eventType: "NOTIFICATION_SCHEDULED",
        tenantId: notification.tenantId,
        payload: { notification, recipients },
      },
      delay,
    );
  }

  // -----------------------------
  // Retry
  // -----------------------------
  async retry(notificationId: string): Promise<void> {
    const notification = await this.notificationRepo.findById(notificationId);
    if (!notification) return;

    const recipients =
      await this.notificationRepo.getRecipients(notificationId);

    await this.dispatch(notification, recipients);
  }

  // -----------------------------
  // Failure handling
  // -----------------------------
  async markAsFailed(notificationId: string, reason: string) {
    await this.notificationRepo.updateStatus(notificationId, {
      status: "FAILED",
      reason,
    });
  }

  // -----------------------------
  // Preferences
  // -----------------------------
  async getUserPreferences(userId: string) {
    return this.preferenceRepo.get(userId);
  }

  async updateUserPreferences(
    userId: string,
    prefs: Partial<NotificationPreferences>,
  ) {
    return this.preferenceRepo.update(userId, prefs);
  }

  // -----------------------------
  // Tracking
  // -----------------------------
  async logDelivery(
    notification: Notification,
    recipient: Recipient,
    channel: NotificationChannel,
    status: "SUCCESS" | "FAILED",
  ) {
    await this.notificationRepo.logDelivery({
      notificationId: notification.id,
      userId: recipient.userId,
      channel,
      status,
    });
  }

  async getNotificationStatus(notificationId: string) {
    return this.notificationRepo.getStatus(notificationId);
  }
}
