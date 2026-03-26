export interface TenantAccountAccess {
  tenant_account_access_id: string;

  tenant_id: string;
  account_id: string;

  role_name?: string | null;

  permissions?: string[] | Record<string, any> | null;

  access_type?: string | null;

  start_time?: Date | null;
  end_time?: Date | null;

  granted_by_account_id?: string | null;

  is_active?: boolean | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
