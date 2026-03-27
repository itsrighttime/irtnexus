const TABLES_WITHOUT_TENANT_ID = new Set<string>([
  "tenants",
  "accounts",
  "account_emails",
  "account_phones",
  "account_names",
  "roles",
  "permissions",
  "role_permissions",
  "account_addresses",
]);

export function haveTenantId(tableName: string): boolean {
  if (!tableName) return false;

  // normalize (important if schemas or casing vary)
  const normalized = tableName.toLowerCase().trim();

  return !TABLES_WITHOUT_TENANT_ID.has(normalized);
}
