export interface AccountFederatedMapping {
  mapping_id: string;

  account_id: string;
  tenant_id: string;

  provider_id: string;

  external_user_id?: string | null;

  last_login?: Date | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
