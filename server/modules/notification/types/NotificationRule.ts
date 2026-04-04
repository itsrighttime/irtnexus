import {
  NotificationChannel,
  NotificationPriority,
  NotificationType,
  UUID,
} from "./common";

export interface NotificationRule {
  rule_id: UUID;

  tenant_id: UUID | null;

  type: NotificationType;

  default_channels?: NotificationChannel[] | null;
  fallback_channels?: NotificationChannel[] | null;

  priority: NotificationPriority;

  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
