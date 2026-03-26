export interface TenantSetting {
  setting_id: string;

  tenant_id: string;

  setting_key: string;
  setting_value: Record<string, any>; // JSONB

  is_encrypted?: boolean | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
