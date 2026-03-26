export interface HardwareKey {
  key_id: string;

  account_id: string;
  tenant_id: string;

  key_type?: string | null; // 'FIDO U2F', 'FIDO2'
  connection_type?: string | null; // 'USB', 'NFC', 'Bluetooth'

  device_info?: Record<string, any> | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
