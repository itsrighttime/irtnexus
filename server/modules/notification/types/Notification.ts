import {
  JSONB,
  NotificationCategory,
  NotificationPriority,
  NotificationType,
  UUID,
} from "./common";

export interface Notification<T = JSONB> {
  notification_id: UUID;

  tenant_id: UUID | null;

  type: NotificationType;
  category: NotificationCategory;

  title?: string | null;
  body?: string | null;
  data?: T | null;

  priority: NotificationPriority;

  scheduled_at?: string | null;

  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
