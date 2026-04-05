import { NotificationRepository } from "../repositories/NotificationRepository";

export class GetUserNotifications {
  constructor(private notificationRepo: NotificationRepository) {}

  async execute(userId: string, options: { limit?: number; offset?: number; unreadOnly?: boolean }) {
    const where: any = { recipient_id: userId };
    if (options.unreadOnly) where.read_at = null;

    return this.notificationRepo.select({ where, limit: options.limit, offset: options.offset }, { accountId: userId, tenantId: "" });
  }
}