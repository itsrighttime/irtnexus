export interface TenantMembership {
  membership_id: string;

  tenant_id: string;
  account_id: string;

  role_id: string;

  status?: string | null;

  joined_at?: Date | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
