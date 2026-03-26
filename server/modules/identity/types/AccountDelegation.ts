export interface AccountDelegation {
  delegation_id: string;

  tenant_id: string;

  delegated_from_account_id: string;
  delegated_to_account_id: string;

  delegation_scope?: Record<string, any> | null;

  start_time?: Date | null;
  end_time?: Date | null;

  is_active?: boolean | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
