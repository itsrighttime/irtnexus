export interface TenantAccessGrant {
  access_grant_id: string;

  tenant_id: string;

  granted_to_user_id: string;
  granted_by_user_id: string;

  role_name: string;

  start_time?: Date | null;
  end_time?: Date | null;

  is_active: boolean;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
