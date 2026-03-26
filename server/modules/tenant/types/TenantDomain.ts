export interface TenantDomain {
  domain_id: string;

  tenant_id: string;

  domain: string;

  is_primary: boolean;
  verified: boolean;

  ssl_status?: string | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}