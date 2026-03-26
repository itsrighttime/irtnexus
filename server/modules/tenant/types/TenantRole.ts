export interface TenantRole {
  role_id: string;

  tenant_id: string;

  role_name: string;

  permissions?: Record<string, any> | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
