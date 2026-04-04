import { JobStatus, UUID } from "./common";

export interface NotificationJob {
  job_id: UUID;

  tenant_id: UUID | null;
  notification_id?: UUID | null;

  status: JobStatus;

  scheduled_at?: string | null;
  processed_at?: string | null;

  attempts: number;

  created_at: Date;
  deleted_at?: Date | null;
}
