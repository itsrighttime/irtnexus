export interface OAuthToken {
  token_id: string;

  account_id: string;
  tenant_id: string;

  token_type?: string | null; // 'access' | 'id' | 'refresh'

  token_value: string;

  scopes?: Record<string, any> | null;

  expires_at?: Date | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
