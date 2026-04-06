// Account status defines the lifecycle or verification state of an account
export const VERIFICATION_STATUS = {
  PENDING: "pending", // Verification is pending and not yet completed
  VERIFIED: "verified", // Verification completed successfully
  EXPIRED: "expired", // Verification token has expired
  FAILED: "failed", // Verification failed (e.g., max attempts reached)
} as const;

export type VerificationStatus =
  (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS];

  
export const VERIFICATION_TYPE = {
  EMAIL: "email",
  PHONE: "phone",
  ADDRESS: "address",
  EMAIL_OTP: "email_otp",
} as const;

export type VerificationType =
  (typeof VERIFICATION_TYPE)[keyof typeof VERIFICATION_TYPE];
