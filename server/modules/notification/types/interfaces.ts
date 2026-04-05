import { DB_RequestContext } from "#packages/database/index.js";
import { PoolClient } from "pg";
import { NotificationChannel, Recipient, NotificationCategory } from ".";

export interface INotificationTemplateService {
  render(
    params: {
      type: string;
      channel: NotificationChannel;
      tenantId: string;
      data?: Record<string, any>;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<{
    subject?: string;
    body: string;
  }>;
}

export interface INotificationPreferenceService {
  resolveAllowedChannels(
    params: {
      accountId: string;
      type: string;
      category: NotificationCategory;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<NotificationChannel[]>;
}

export interface INotificationDispatcher {
  dispatchToChannel(
    params: {
      notificationId: string;
      tenantId: string;
      recipient: Recipient;
      channel: NotificationChannel;
      contentResolver: (channel: NotificationChannel) => Promise<any>;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<void>;
}

export interface INotificationScheduler {
  schedule(
    params: { notificationId: string; sendAt: Date },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<void>;
}

export interface INotificationTrackingService {
  createNotificationRecord(
    params: {
      type: string;
      category: NotificationCategory;
      tenantId: string;
      data?: Record<string, any>;
      priority?: string;
      scheduledAt?: Date;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<{ notificationId: string }>;

  createRecipientRecord(
    params: {
      notificationId: string;
      accountId: string;
      channel: NotificationChannel;
    },
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<{ recipientId: string }>;
}
