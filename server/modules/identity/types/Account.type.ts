export interface Account {
  account_id: string;

  username: string;

  status: string;
  identity_level: string;

  preferred_language?: string | null;
  preferred_timezone?: string | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}