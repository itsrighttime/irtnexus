export interface ApiKey {
  key_id: string;

  account_id: string;
  tenant_id: string;

  key_value: string;

  description?: string | null;

  permissions?: Record<string, any> | null;

  is_active?: boolean | null;

  expires_at?: Date | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
