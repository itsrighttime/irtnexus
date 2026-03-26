export interface TemporarySession {
  session_id: string;

  account_id: string;
  tenant_id: string;

  session_pin?: string | null;

  expires_at?: Date | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
