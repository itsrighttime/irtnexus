export interface Password {
  password_id: string;

  account_id: string;
  tenant_id: string;

  password_hash: string;
  salt?: string | null;

  last_changed_at?: Date | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
