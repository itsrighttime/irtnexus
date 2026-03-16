import { BADGE_KEYS } from "../badgeDefinitions.js";

export const userProfileFields = [
  {
    id: "email",
    leftIcon: "UsersIcon",
    title: "Email",
    value: "john.doe@example.com",
    badges: [
      { id: BADGE_KEYS.VERIFIED, tooltip: "Verified via email" },
      { id: BADGE_KEYS.HIGH_TRUST, tooltip: "High trust score" },
      { id: BADGE_KEYS.PRIVATE, tooltip: "Private field" },
    ],
  },
  {
    id: "subscription",
    leftIcon: "MoonIcon",
    title: "Subscription",
    value: "Premium Plan",
    badges: [
      { id: BADGE_KEYS.HIGH_TRUST, tooltip: "High trust" },
      { id: BADGE_KEYS.ISSUER_SIGNED, tooltip: "Issuer signed" },
    ],
  },
  {
    id: "security",
    leftIcon: "AccessIcon",
    title: "Security",
    value: "2FA Enabled",
    badges: [
      { id: BADGE_KEYS.HIGH_TRUST, tooltip: "High trust" },
      { id: BADGE_KEYS.RECENTLY_VERIFIED, tooltip: "Recently verified" },
    ],
  },
];
