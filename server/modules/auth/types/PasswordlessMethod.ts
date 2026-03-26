export interface PasswordlessMethod {
  method_id: string;

  account_id: string;
  tenant_id: string;

  method_type: string; // 'magic_link' | 'otp' | 'totp' | 'passkey' | 'push'
  channel?: string | null; // 'email' | 'sms' | 'whatsapp'

  device_info?: Record<string, any> | null;

  last_used_at?: Date | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}