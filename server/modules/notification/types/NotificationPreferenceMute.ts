import { NotificationCategory, NotificationType, UUID } from "./common";

export interface NotificationPreferenceMute {
  mute_id: UUID;

  tenant_id: UUID | null;
  preference_id: UUID | null;

  type?: NotificationType | null;
  category?: NotificationCategory | null;

  created_at: Date;
  deleted_at?: Date | null;
}
