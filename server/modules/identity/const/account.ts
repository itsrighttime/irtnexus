// Account status defines the lifecycle or verification state of an account
export const ACCOUNT_STATUS = {
  ACTIVE: "active", // Account is active and usable
  INACTIVE: "inactive", // Temporarily disabled or not yet verified
  SUSPENDED: "suspended", // Account is suspended due to issues
  DELETED: "deleted", // Soft-deleted (matches deleted_at)
  PENDING_VERIFICATION: "pending_verification", // Newly created, awaiting verification
} as const;

export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

// Identity level defines the role/permission tier in the account
export const ACCOUNT_IDENTITY_LEVEL = {
  UNVERIFIED: "unverified", // Just signed up, no verification
  VERIFIED: "verified", // Email verified or basic KYC
  TRUSTED: "trusted", // Verified + additional checks (phone, docs)
  SUPER_TRUSTED: "super_trusted", // Internal system trust, e.g., platform admin
} as const;

export type AccountIdentityLevel =
  (typeof ACCOUNT_IDENTITY_LEVEL)[keyof typeof ACCOUNT_IDENTITY_LEVEL];
