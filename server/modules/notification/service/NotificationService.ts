import { DB_RequestContext } from "#packages/database";
import { PoolClient } from "pg";

import {
  SendNotificationInput,
  NotificationChannel,
  INotificationTemplateService,
  INotificationPreferenceService,
  INotificationDispatcher,
  INotificationScheduler,
  INotificationTrackingService,
} from "../types";

export class NotificationService {
  constructor(
    private readonly templateService: INotificationTemplateService,
    private readonly preferenceService: INotificationPreferenceService,
    private readonly dispatcher: INotificationDispatcher,
    private readonly scheduler: INotificationScheduler,
    private readonly trackingService: INotificationTrackingService,
  ) {}

  async send(
    input: SendNotificationInput,
    ctx: DB_RequestContext,
    client?: PoolClient,
  ): Promise<void> {
    const { type, category, tenantId, recipients, data, sendAt, priority } =
      input;

    if (!recipients?.length) return;

    // 1 Create notification record
    const { notificationId } =
      await this.trackingService.createNotificationRecord(
        {
          type,
          category,
          tenantId,
          data,
          priority,
          scheduledAt: sendAt,
        },
        ctx,
        client,
      );

    // 2 Scheduling
    if (sendAt && sendAt.getTime() > Date.now()) {
      await this.scheduler.schedule(
        {
          notificationId,
          sendAt,
        },
        ctx,
        client,
      );
      return;
    }

    // 3 Process each recipient
    for (const recipient of recipients) {
      // 3.1 Resolve allowed channels
      const channels = await this.preferenceService.resolveAllowedChannels(
        {
          accountId: recipient.accountId,
          type,
          category,
        },
        ctx,
        client,
      );

      if (!channels.length) continue;

      // 3.2 Create recipient records (tracking)
      for (const channel of channels) {
        const { recipientId } =
          await this.trackingService.createRecipientRecord(
            {
              notificationId,
              accountId: recipient.accountId,
              channel,
            },
            ctx,
            client,
          );

        // 3.3 Dispatch
        await this.dispatcher.dispatchToChannel(
          {
            notificationId,
            tenantId,
            recipient,
            channel,
            contentResolver: async (channel: NotificationChannel) => {
              return this.templateService.render(
                {
                  type,
                  channel,
                  tenantId,
                  data,
                },
                ctx,
                client,
              );
            },
          },
          ctx,
          client,
        );
      }

      await Promise.all(
        channels.map(async (channel) => {
          await this.trackingService.createRecipientRecord(
            {
              notificationId,
              accountId: recipient.accountId,
              channel,
            },
            ctx,
            client,
          );

          await this.dispatcher.dispatchToChannel(
            {
              notificationId,
              tenantId,
              recipient,
              channel,
              contentResolver,
            },
            ctx,
            client,
          );
        }),
      );
    }

    const contentResolver = async (channel: NotificationChannel) => {
      return this.templateService.render(
        {
          type,
          channel,
          tenantId,
          data,
        },
        ctx,
        client,
      );
    };
  }
}
