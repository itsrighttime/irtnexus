export interface TenantOwner {
  tenant_owner_id: string;

  tenant_id: string;
  account_id: string;

  ownership_percentage: number;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
