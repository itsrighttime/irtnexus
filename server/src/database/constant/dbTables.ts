export const TABLES = {
  USERS: ["users", "user_permissions"],

  AUTH: ["auth_credentials", "user_keys"],

  CONTACTS: ["user_names", "user_emails", "user_phones", "user_addresses"],

  TENANTS: [
    "tenants",
    "tenant_settings",
    "tenant_branding",
    "tenant_domains",
    "tenant_security_policies",
    "platform_plans",
  ],

  SUBS: [
    "platform_plans",
    "platform_plan_pricing",
    "platform_features",
    "platform_feature_pricing",
    "platform_subscriptions",
    "platform_subscription_addons",
  ],

  AUDIT: [
    "audit_logs",
    "platform_ledger_transactions",
    "platform_payment_transactions",
    "platform_invoice_items",
    "platform_invoice_taxes",
    "ledger_transactions",
    "journal_entries",
    "journal_lines",
    "payment_transactions",
    "invoice_items",
    "invoice_taxes",
  ],

  BILLING: [
    "platform_wallets",
    "platform_invoices",
    "chart_of_accounts",
    "wallets",
    "tax_codes",
    "invoices",
  ],
};
