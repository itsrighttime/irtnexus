export interface AccountEmail {
  email_id: string;

  account_id: string;

  email: string;

  verified_at?: Date | null;
  is_primary?: boolean | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
