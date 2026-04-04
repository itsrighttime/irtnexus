export const TABLES = {
  USERS: [
    "accounts",
    "tenant_account_access",
    "account_delegations",
    "tenant_memberships",
    "roles",
    "permissions",
    "role_permissions",
    "verifications",
  ],

  AUTH: [
    "passwordless_methods",
    "mfa_factors",
    "api_keys",
    "oauth_tokens",
    "passwords",
    "sso_providers",
    "account_sso_mapping",
    "federated_providers",
    "account_federated_mapping",
    "risk_signals",
    "hardware_keys",
    "temporary_sessions",
  ],

  CONTACTS: [
    "account_emails",
    "account_phones",
    "account_names",
    "account_addresses",
  ],

  TENANTS: [
    "tenants",
    "tenant_domains",
    "tenant_settings",
    "tenant_owners",
    "tenant_access_grants",
    "email_branding",
    "portal_branding",
    "tenant_roles",
    "tenant_addresses",
  ],

  SUBS: [],

  AUDIT: ["audit_logs"],

  BILLING: [],

  NOTIFICATION: [
    "notifications",
    "notification_recipients",
    "notification_preferences",
    "notification_preference_mutes",
    "notification_templates",
    "notification_rules",
    "notification_logs",
    "notification_jobs",
  ],
};
