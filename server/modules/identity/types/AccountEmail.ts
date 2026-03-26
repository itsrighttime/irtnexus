export interface AccountEmail {
  email_id: string;

  account_id: string;

  email: string;

  verified?: boolean | null;
  is_primary?: boolean | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
