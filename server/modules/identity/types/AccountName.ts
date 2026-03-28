export interface AccountName {
  name_id: string;

  account_id: string;

  full_name: string;
  name_type: string;

  verified_at?: Date | null;

  valid_from?: Date | null;
  valid_to?: Date | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
