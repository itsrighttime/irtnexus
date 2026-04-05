import { EventBus, BaseEvent } from "#packages/event-bus";
import { DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { INotificationScheduler } from "../types";

export class NotificationScheduler implements INotificationScheduler {
  constructor(private eventBus: EventBus) {}

  /**
   * Schedule a notification
   */
  async schedule(
    params: {
      notificationId: string;
      sendAt: Date;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<void> {
    const { notificationId, sendAt } = params;

    const delay = sendAt.getTime() - Date.now();

    const event = {
      eventType: "NOTIFICATION_SCHEDULED",
      tenantId: ctx.tenantId,
      payload: {
        notificationId,
      },
    };

    if (delay <= 0) {
      // send immediately
      await this.eventBus.publish(event);
      return;
    }

    await this.eventBus.publishDelayed(event, delay);
  }

  /**
   * Handle scheduled event → trigger actual dispatch
   */
  async handleScheduledEvent(event: BaseEvent): Promise<void> {
    const { notificationId } = event.payload;

    if (!notificationId) return;

    await this.eventBus.publish({
      eventType: "NOTIFICATION_DISPATCH",
      tenantId: event.tenantId,
      payload: {
        notificationId,
      },
    });
  }
}
