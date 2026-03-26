export interface Account {
  account_id: string;

  username: string;

  status: string;
  identity_level: string;

  preferred_language?: string;
  preferred_timezone?: string;

  created_at: Date;
  updated_at: Date;
}
