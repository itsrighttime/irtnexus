import { DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";
import { repoNotification, repoNotificationRecipient } from "../repository";
import {
  INotificationTrackingService,
  Notification,
  NotificationCategory,
  NotificationChannel,
  NotificationPriority,
  NotificationRecipient,
  NotificationType,
} from "../types";

export class NotificationTrackingService implements INotificationTrackingService {
  /** ----------------- Notification Record ----------------- */
  async createNotificationRecord(
    params: {
      type: NotificationType;
      category: NotificationCategory;
      tenantId: string;
      data?: Record<string, any>;
      priority?: NotificationPriority;
      scheduledAt?: Date;
    },
    ctx: DB_RequestContext,
    client: PoolClient,
  ): Promise<{ notificationId: string }> {
    const record: Partial<Notification> = {
      type: params.type,
      category: params.category,
      tenant_id: params.tenantId,
      data: params.data || {},
      priority: params.priority || "NORMAL",
      scheduled_at: params.scheduledAt || null,
    };

    const created = await repoNotification.create(record, ctx, client);

    return { notificationId: created.notification_id };
  }

  /** ----------------- Recipient Record ----------------- */
  async createRecipientRecord(
    params: {
      notificationId: string;
      accountId: string;
      channel: NotificationChannel;
    },
    ctx: DB_RequestContext,
    client: PoolClient,
  ): Promise<{ recipientId: string }> {
    const record: Partial<NotificationRecipient> = {
      notification_id: params.notificationId,
      account_id: params.accountId,
      channel: params.channel,
      read_at: null,
      delivered_at: null,
    };

    const created = await repoNotificationRecipient.create(record, ctx, client);

    return { recipientId: created.recipient_id };
  }

  /** ----------------- Mark Notification as Read ----------------- */
  async markAsRead(
    params: { recipientId: string },
    ctx: DB_RequestContext,
    client: PoolClient,
  ): Promise<void> {
    await repoNotificationRecipient.update(
      params.recipientId,
      { read_at: new Date(), is_read: true },
      ctx,
      client,
    );
  }

  /** ----------------- Get Notifications for User ----------------- */
  async getUserNotifications(
    params: { limit?: number; unreadOnly?: boolean },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<NotificationRecipient[]> {
    const where: any = { account_id: ctx.accountId };
    if (params?.unreadOnly) where.read_at = null;

    return repoNotificationRecipient.select(
      {
        where,
        orderBy: [{ column: "created_at", direction: "DESC" }],
        limit: params?.limit,
      },
      ctx,
      client,
    );
  }
}
