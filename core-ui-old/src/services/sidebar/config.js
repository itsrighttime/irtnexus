import { EP_ROUTE_KEYS, SIDEBAR_KEYS } from "#constants";

export const sidebarConfig = [
  {
    key: SIDEBAR_KEYS.account_identity,
    label: "Account & Identity",
    children: [
      {
        key: SIDEBAR_KEYS.profile,
        label: "Profile",
        route: EP_ROUTE_KEYS.profile,
      },
      {
        key: SIDEBAR_KEYS.authentication,
        label: "Authentication",
        route: EP_ROUTE_KEYS.authentication,
      },
      {
        key: SIDEBAR_KEYS.roles_authority,
        label: "Roles & Authority",
        route: EP_ROUTE_KEYS.roles_authority,
      },
    ],
  },
  {
    key: SIDEBAR_KEYS.access_tenancy,
    label: "Access & Tenancy",
    children: [
      {
        key: SIDEBAR_KEYS.tenants,
        label: "Tenants",
        route: EP_ROUTE_KEYS.tenants,
      },
      {
        key: SIDEBAR_KEYS.access_entitlements,
        label: "Access & Entitlements",
        route: EP_ROUTE_KEYS.access_entitlements,
      },
      {
        key: SIDEBAR_KEYS.lifecycle,
        label: "Lifecycle",
        route: EP_ROUTE_KEYS.lifecycle,
      },
    ],
  },
  {
    key: SIDEBAR_KEYS.security_trust,
    label: "Security & Trust",
    children: [
      {
        key: SIDEBAR_KEYS.risk_trust,
        label: "Risk & Trust",
        route: EP_ROUTE_KEYS.risk_trust,
      },
      {
        key: SIDEBAR_KEYS.devices_trust,
        label: "Devices & Trust",
        route: EP_ROUTE_KEYS.devices_trust,
      },
      {
        key: SIDEBAR_KEYS.security_nudges,
        label: "Security Nudges",
        route: EP_ROUTE_KEYS.security_nudges,
      },
    ],
  },
  {
    key: SIDEBAR_KEYS.activity_transparency,
    label: "Activity & Transparency",
    children: [
      {
        key: SIDEBAR_KEYS.activity_decisions,
        label: "Activity & Decisions",
        route: EP_ROUTE_KEYS.activity_decisions,
      },
      {
        key: SIDEBAR_KEYS.transparency,
        label: "Transparency",
        route: EP_ROUTE_KEYS.transparency,
      },
    ],
  },
  {
    key: SIDEBAR_KEYS.data_authority,
    label: "Data & Authority",
    children: [
      {
        key: SIDEBAR_KEYS.data_vault,
        label: "Data Vault",
        route: EP_ROUTE_KEYS.data_vault,
      },
      {
        key: SIDEBAR_KEYS.consent_compliance,
        label: "Consent & Compliance",
        route: EP_ROUTE_KEYS.consent_compliance,
      },
    ],
  },
  {
    key: SIDEBAR_KEYS.safety_continuity,
    label: "Safety & Continuity",
    children: [
      {
        key: SIDEBAR_KEYS.emergency_recovery,
        label: "Emergency & Recovery",
        route: EP_ROUTE_KEYS.emergency_recovery,
      },
    ],
  },
  {
    key: SIDEBAR_KEYS.help_enablement,
    label: "Help & Enablement",
    children: [
      {
        key: SIDEBAR_KEYS.security_guidance,
        label: "Security Guidance",
        route: EP_ROUTE_KEYS.security_guidance,
      },
    ],
  },
];
