import { JSONB, NotificationChannel, NotificationStatus, UUID } from "./common";

export interface NotificationRecipient {
  recipient_id: UUID;

  notification_id: UUID | null;
  tenant_id: UUID | null;

  user_id?: UUID | null;

  channel: NotificationChannel;
  status: NotificationStatus;

  attempts: number;
  last_attempt_at?: string | null;

  is_read: boolean;
  read_at?: Date | null;

  provider_response?: JSONB | null;

  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
