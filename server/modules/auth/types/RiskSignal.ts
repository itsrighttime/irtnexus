export interface RiskSignal {
  signal_id: string;

  account_id: string;
  tenant_id: string;

  signal_type?: string | null; // 'device_fingerprint', 'geoip', etc.

  signal_data?: Record<string, any> | null;

  detected_at?: Date | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
