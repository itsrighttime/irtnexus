import {
  TenantIcon,
  AccountIcon,
  LockIcon,
  UsersIcon,
  AccessIcon,
  LifeCycleIcon,
  SecurityIcon,
  DataIcon,
  SafetyIcon,
  HelpIcon,
  ActivityIcon,
  ConcentIcon,
  TrustIcon,
  DeviceIcon,
  TransperancyIcon,
} from "./list01.jsx";

export const sidebarIconMap = {
  // Account & Identity
  profile: AccountIcon,
  authentication: LockIcon,
  roles_authority: UsersIcon,

  // Access & Tenancy
  tenants: TenantIcon,
  access_entitlements: AccessIcon,
  lifecycle: LifeCycleIcon,

  // Security & Trust
  risk_trust: TrustIcon,
  devices_trust: DeviceIcon,
  security_nudges: SecurityIcon,

  // Activity & Transparency
  activity_decisions: ActivityIcon,
  transparency: TransperancyIcon,

  // Data & Authority
  data_vault: DataIcon,
  consent_compliance: ConcentIcon,

  // Safety & Continuity
  emergency_recovery: SafetyIcon,

  // Support
  security_guidance: HelpIcon,
};
