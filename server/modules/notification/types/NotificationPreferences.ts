import { NotificationChannel, UUID } from "./common";

export interface NotificationPreferences {
  preference_id: UUID;

  tenant_id: UUID | null;
  account_id: UUID | null;

  channels_enabled?: Record<NotificationChannel, boolean> | null;
  mute_per_channel?: Record<NotificationChannel, boolean> | null;

  channel_configs?: {
    EMAIL?: { email: string };
    SMS?: { phone: string };
    PUSH?: { deviceToken: string };
    IN_APP?: Record<string, any>;
  } | null;

  is_muted: boolean;

  dnd_start?: Date | null; // TIME
  dnd_end?: Date | null;

  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
