import { NotificationDispatcher } from "../services/NotificationDispatcher";
import { NotificationRepository } from "../repositories/NotificationRepository";

export class RetryNotification {
  constructor(
    private dispatcher: NotificationDispatcher,
    private notificationRepo: NotificationRepository
  ) {}

  async execute(failedNotificationIds: string[]) {
    const failedNotifications = await this.notificationRepo.select({
      where: { notification_id: failedNotificationIds, status: "FAILED" }
    }, { accountId: "", tenantId: "" });

    for (const notif of failedNotifications) {
      await this.dispatcher.dispatch(notif);
    }

    return failedNotifications.length;
  }
}