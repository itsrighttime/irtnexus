export const AccountCol = [
  "account_id",
  "username",
  "status",
  "identity_level",
  "preferred_language",
  "preferred_timezone",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const AccountAddressCol = [
  "address_id",
  "tenant_id",
  "account_id",
  "address_type",
  "house_no",
  "street_no",
  "block_no",
  "city",
  "district",
  "state",
  "country",
  "pincode",
  "verified_at",
  "valid_from",
  "valid_to",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const AccountDelegationCol = [
  "delegation_id",
  "tenant_id",
  "delegated_from_account_id",
  "delegated_to_account_id",
  "delegation_scope",
  "start_time",
  "end_time",
  "is_active",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const AccountEmailCol = [
  "email_id",
  "account_id",
  "email",
  "verified_at",
  "is_primary",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const AccountNameCol = [
  "name_id",
  "account_id",
  "full_name",
  "name_type",
  "verified_at",
  "valid_from",
  "valid_to",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const AccountPhoneCol = [
  "phone_id",
  "account_id",
  "phone_number",
  "verified_at",
  "is_primary",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const PermissionCol = [
  "permission_id",
  "name",
  "description",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const RoleCol = [
  "role_id",
  "name",
  "description",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const RolePermissionCol = [
  "role_permission_id",
  "role_id",
  "permission_id",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const TenantAccountAccessCol = [
  "tenant_account_access_id",
  "tenant_id",
  "account_id",
  "role_name",
  "permissions",
  "access_type",
  "start_time",
  "end_time",
  "granted_by_account_id",
  "is_active",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const TenantMembershipCol = [
  "membership_id",
  "tenant_id",
  "account_id",
  "role_id",
  "status",
  "joined_at",
  "deleted_at",
  "created_at",
  "updated_at",
];
export const VerificationCol = [
  "verification_id",
  "tenant_id",
  "account_id",
  "target_id",
  "type",
  "token",
  "status",
  "expires_at",
  "verified_at",
  "deleted_at",
  "created_at",
];
