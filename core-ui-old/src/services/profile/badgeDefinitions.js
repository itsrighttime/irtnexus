export const BADGE_CATEGORIES = {
  verification: "verification",
  trust: "trust",
  proof: "proof",
  privacy: "privacy",
};

export const BADGE_KEYS = {
  // Verification badges
  VERIFIED: "VERIFIED",
  VERIFIED_BY_ISSUER: "VERIFIED_BY_ISSUER",
  DOCUMENT_VERIFIED: "DOCUMENT_VERIFIED",
  LIVENESS_VERIFIED: "LIVENESS_VERIFIED",
  ADDRESS_VERIFIED: "ADDRESS_VERIFIED",

  // Trust badges
  HIGH_TRUST: "HIGH_TRUST",
  MEDIUM_TRUST: "MEDIUM_TRUST",
  LOW_TRUST: "LOW_TRUST",

  // Proof badges
  ISSUER_SIGNED: "ISSUER_SIGNED",
  EXTERNAL_SOURCE: "EXTERNAL_SOURCE",
  USER_ASSERTED: "USER_ASSERTED",
  RECENTLY_VERIFIED: "RECENTLY_VERIFIED",

  // Privacy badges
  PRIVATE: "PRIVATE",
  TRUSTED_TENANTS: "TRUSTED_TENANTS",
  TENANT_SPECIFIC: "TENANT_SPECIFIC",
  PUBLIC: "PUBLIC",
};

export const BADGE_DEFINITIONS = {
  [BADGE_KEYS.VERIFIED]: {
    id: BADGE_KEYS.VERIFIED,
    category: BADGE_CATEGORIES.verification,
    label: "Verified",
  },
  [BADGE_KEYS.VERIFIED_BY_ISSUER]: {
    id: BADGE_KEYS.VERIFIED_BY_ISSUER,
    category: BADGE_CATEGORIES.verification,
    label: "Verified by Issuer",
  },
  [BADGE_KEYS.DOCUMENT_VERIFIED]: {
    id: BADGE_KEYS.DOCUMENT_VERIFIED,
    category: BADGE_CATEGORIES.verification,
    label: "Document Verified",
  },
  [BADGE_KEYS.LIVENESS_VERIFIED]: {
    id: BADGE_KEYS.LIVENESS_VERIFIED,
    category: BADGE_CATEGORIES.verification,
    label: "Liveness Verified",
  },
  [BADGE_KEYS.ADDRESS_VERIFIED]: {
    id: BADGE_KEYS.ADDRESS_VERIFIED,
    category: BADGE_CATEGORIES.verification,
    label: "Address Verified",
  },

  [BADGE_KEYS.HIGH_TRUST]: {
    id: BADGE_KEYS.HIGH_TRUST,
    category: BADGE_CATEGORIES.trust,
    label: "High Trust",
  },
  [BADGE_KEYS.MEDIUM_TRUST]: {
    id: BADGE_KEYS.MEDIUM_TRUST,
    category: BADGE_CATEGORIES.trust,
    label: "Medium Trust",
  },
  [BADGE_KEYS.LOW_TRUST]: {
    id: BADGE_KEYS.LOW_TRUST,
    category: BADGE_CATEGORIES.trust,
    label: "Low Trust",
  },

  [BADGE_KEYS.ISSUER_SIGNED]: {
    id: BADGE_KEYS.ISSUER_SIGNED,
    category: BADGE_CATEGORIES.proof,
    label: "Issuer Signed",
  },
  [BADGE_KEYS.EXTERNAL_SOURCE]: {
    id: BADGE_KEYS.EXTERNAL_SOURCE,
    category: BADGE_CATEGORIES.proof,
    label: "External Source",
  },
  [BADGE_KEYS.USER_ASSERTED]: {
    id: BADGE_KEYS.USER_ASSERTED,
    category: BADGE_CATEGORIES.proof,
    label: "User Self-Asserted",
  },
  [BADGE_KEYS.RECENTLY_VERIFIED]: {
    id: BADGE_KEYS.RECENTLY_VERIFIED,
    category: BADGE_CATEGORIES.proof,
    label: "Recently Verified",
  },

  [BADGE_KEYS.PRIVATE]: {
    id: BADGE_KEYS.PRIVATE,
    category: BADGE_CATEGORIES.privacy,
    label: "Private",
  },
  [BADGE_KEYS.TRUSTED_TENANTS]: {
    id: BADGE_KEYS.TRUSTED_TENANTS,
    category: BADGE_CATEGORIES.privacy,
    label: "Trusted Tenants",
  },
  [BADGE_KEYS.TENANT_SPECIFIC]: {
    id: BADGE_KEYS.TENANT_SPECIFIC,
    category: BADGE_CATEGORIES.privacy,
    label: "Tenant Specific",
  },
  [BADGE_KEYS.PUBLIC]: {
    id: BADGE_KEYS.PUBLIC,
    category: BADGE_CATEGORIES.privacy,
    label: "Public",
  },
};
