import { NotificationTrackingService } from "../service/NotificationTrackingService";

export class MarkAsRead {
  constructor(private trackingService: NotificationTrackingService) {}

  async execute(notificationIds: string[], userId: string) {
    return this.trackingService.markAsRead(notificationIds, userId);
  }
}