import { VerificationStatus, VerificationType } from "../const";

export interface Verification {
  verification_id: string; // UUID
  tenant_id: string | null; // UUID (nullable if FK allows)
  account_id: string | null; // UUID (nullable if FK allows)
  target_id: string; // UUID or identifier of target (email_id, phone_id, etc.)

  type: VerificationType;
  token: string;

  status: VerificationStatus;

  expires_at: Date; // ISO timestamp
  verified_at: Date | null;
  deleted_at: Date | null;

  created_at: Date; // ISO timestamp
}
