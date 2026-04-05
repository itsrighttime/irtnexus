import { DB_RequestContext } from "#packages/database";
import { NotificationService } from "../service/NotificationService";

export class SendNotification {
  constructor(private notificationService: NotificationService) {}

  async execute(
    tenantId: string,
    recipientIds: string[],
    notificationType: string,
    payload: Record<string, any>,
    ctx: DB_RequestContext,
  ) {
    return this.notificationService.sendNotification({
      tenantId,
      recipientIds,
      type: notificationType,
      payload,
      ctx,
    });
  }
}
