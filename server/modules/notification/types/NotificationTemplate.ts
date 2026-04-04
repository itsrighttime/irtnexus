import { NotificationChannel, NotificationType, UUID } from "./common";

export interface NotificationTemplate {
  template_id: UUID;

  tenant_id: UUID | null;

  type: NotificationType;
  channel: NotificationChannel;

  subject?: string | null;
  body: string;

  locale: string;
  version: number;

  is_active: boolean;

  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
