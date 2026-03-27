export const AccountFederatedMappingCol = [
  "mapping_id",
  "account_id",
  "tenant_id",
  "provider_id",
  "external_user_id",
  "last_login",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const AccountSsoMappingCol = [
  "mapping_id",
  "account_id",
  "tenant_id",
  "sso_id",
  "external_user_id",
  "last_login",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const ApiKeyCol = [
  "key_id",
  "account_id",
  "tenant_id",
  "key_value",
  "description",
  "permissions",
  "is_active",
  "expires_at",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const FederatedProviderCol = [
  "provider_id",
  "tenant_id",
  "provider_name",
  "type",
  "protocol",
  "config",
  "is_active",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const HardwareKeyCol = [
  "key_id",
  "account_id",
  "tenant_id",
  "key_type",
  "connection_type",
  "device_info",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const MfaFactorCol = [
  "factor_id",
  "account_id",
  "tenant_id",
  "factor_type",
  "is_primary",
  "is_step_up",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const OAuthTokenCol = [
  "token_id",
  "account_id",
  "tenant_id",
  "token_type",
  "token_value",
  "scopes",
  "expires_at",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const PasswordCol = [
  "password_id",
  "account_id",
  "tenant_id",
  "password_hash",
  "salt",
  "last_changed_at",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const PasswordlessMethodCol = [
  "method_id",
  "account_id",
  "tenant_id",
  "method_type",
  "channel",
  "device_info",
  "last_used_at",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const RiskSignalCol = [
  "signal_id",
  "account_id",
  "tenant_id",
  "signal_type",
  "signal_data",
  "detected_at",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const SsoProviderCol = [
  "sso_id",
  "tenant_id",
  "provider_name",
  "protocol",
  "config",
  "is_active",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const TemporarySessionCol = [
  "session_id",
  "account_id",
  "tenant_id",
  "session_pin",
  "expires_at",
  "deleted_at",
  "created_at",
  "updated_at",
];
