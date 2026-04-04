import { DeliveryStatus, JSONB, NotificationChannel, UUID } from "./common";

export interface NotificationLog {
  log_id: UUID;

  notification_id?: UUID | null;
  recipient_id?: UUID | null;

  tenant_id: UUID | null;

  channel?: NotificationChannel | null;
  status?: DeliveryStatus | null;

  message?: string | null;
  provider_response?: JSONB | null;

  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
