import {
  Recipient,
  NotificationChannel,
  INotificationDispatcher,
} from "../types";
import { EventBus } from "#packages/event-bus";
import { DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";

export class NotificationDispatcher implements INotificationDispatcher {
  constructor(private eventBus: EventBus) {}

  async dispatchToChannel(
    params: {
      notificationId: string;
      tenantId: string;
      recipient: Recipient;
      channel: NotificationChannel;
      contentResolver: (channel: NotificationChannel) => Promise<{ subject?: string; body: string }>;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<void> {
    const { notificationId, tenantId, recipient, channel, contentResolver } =
      params;

    try {
      const content = await contentResolver(channel);

      await this.eventBus.publish({
        eventType: `NOTIFICATION_${channel}_SEND`,
        tenantId,
        payload: {
          notificationId,
          recipient,
          channel,
          content,
        },
      });
    } catch (err) {
      console.error(
        `Failed to dispatch notification ${notificationId} to user ${recipient.accountId} via ${channel}`,
        err,
      );
    }
  }
}
