export interface MfaFactor {
  factor_id: string;

  account_id: string;
  tenant_id: string;

  factor_type: string; // 'otp' | 'totp' | 'push' | 'passkey' | 'password'

  is_primary?: boolean | null;
  is_step_up?: boolean | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
