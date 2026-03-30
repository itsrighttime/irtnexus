export const TENANT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;

export type TenantStatus = (typeof TENANT_STATUS)[keyof typeof TENANT_STATUS];

export const TENANT_TYPE = {
  FREE: "FREE",
  PREMIUM: "PREMIUM",
  ENTERPRISE: "ENTERPRISE",
} as const;

export type TenantType = (typeof TENANT_TYPE)[keyof typeof TENANT_TYPE];

export const TENANT_THEME = {
  LIGHT: "LIGHT",
  DARK: "DARK",
  AUTO: "AUTO",
} as const;

export type TenantTheme = (typeof TENANT_THEME)[keyof typeof TENANT_THEME];
