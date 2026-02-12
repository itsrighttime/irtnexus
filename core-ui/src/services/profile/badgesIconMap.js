import { BADGE_KEYS } from "./badgeDefinitions.js";

export const BADGE_ICON_MAP = {
  [BADGE_KEYS.VERIFIED]: { color: "#2F8BFF", name: "VerifiedIcon" },
  [BADGE_KEYS.VERIFIED_BY_ISSUER]: {
    color: "#2F8BFF",
    name: "VerifiedByIssuerIcon",
  },
  [BADGE_KEYS.DOCUMENT_VERIFIED]: {
    color: "#3AC7C1",
    name: "DocumentVerifiedIcon",
  },
  [BADGE_KEYS.LIVENESS_VERIFIED]: {
    color: "#22C55E",
    name: "LivenessVerifiedIcon",
  },
  [BADGE_KEYS.ADDRESS_VERIFIED]: {
    color: "#38BDF8",
    name: "AddressVerifiedIcon",
  },

  [BADGE_KEYS.HIGH_TRUST]: { color: "#22C55E", name: "HighTrustIcon" },
  [BADGE_KEYS.MEDIUM_TRUST]: { color: "#F59E0B", name: "MediumTrustIcon" },
  [BADGE_KEYS.LOW_TRUST]: { color: "#F97316", name: "LowTrustIcon" },

  [BADGE_KEYS.ISSUER_SIGNED]: { color: "#748b77", name: "IssuerSignedIcon" },
  [BADGE_KEYS.EXTERNAL_SOURCE]: {
    color: "#a799b3",
    name: "ExternalSourceIcon",
  },
  [BADGE_KEYS.USER_ASSERTED]: { color: "#A78BFA", name: "UserAssertedIcon" },
  [BADGE_KEYS.RECENTLY_VERIFIED]: { color: "#60A5FA", name: "RecenlyIcon" },

  [BADGE_KEYS.PRIVATE]: { color: "#0e307a", name: "LockIcon" },
  [BADGE_KEYS.TRUSTED_TENANTS]: {
    color: "#0EA5E9",
    name: "TrustedPartnersIcon",
  },
  [BADGE_KEYS.TENANT_SPECIFIC]: { color: "#6D28D9", name: "TenantIcon" },
  [BADGE_KEYS.PUBLIC]: { color: "#22C55E", name: "GlobeIcon" },
};

export const getMetaForBadge = (badgeId) => {
  return (
    BADGE_ICON_MAP[badgeId] || { color: "#6B7280", name: "DefaultBadgeIcon" }
  );
};
