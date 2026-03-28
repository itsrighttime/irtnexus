export interface AccountPhone {
  phone_id: string;

  account_id: string;

  phone_number: string;

  verified_at?: Date | null;
  is_primary?: boolean | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
