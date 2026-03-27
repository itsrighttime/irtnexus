export const EmailBrandingCol = [
  "email_branding_id",
  "tenant_id",
  "sender_name",
  "sender_email",
  "header_logo_url",
  "footer_logo_url",
  "footer_text",
  "primary_color",
  "secondary_color",
  "font_family",
  "template_overrides",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const PortalBrandingCol = [
  "portal_branding_id",
  "tenant_id",
  "login_background_url",
  "login_message",
  "login_button_style",
  "custom_css",
  "favicon_url",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const RegisterTenantInputCol = [
  "adminName",
  "adminEmail",
  "adminPhone",
  "username",
  "organizationName",
  "identifier",
];

export const TenantCol = [
  "tenant_id",
  "name",
  "identifier",
  "plan",
  "status",
  "logo_url",
  "favicon_url",
  "primary_color",
  "secondary_color",
  "background_color",
  "background_image_url",
  "font_family",
  "font_size_base",
  "font_weight_base",
  "border_radius",
  "border_color",
  "shadow_style",
  "spacing_base",
  "theme_mode",
  "custom_css",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const TenantAccessGrantCol = [
  "access_grant_id",
  "tenant_id",
  "granted_to_user_id",
  "granted_by_user_id",
  "role_name",
  "start_time",
  "end_time",
  "is_active",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const TenantDomainCol = [
  "domain_id",
  "tenant_id",
  "domain",
  "is_primary",
  "verified",
  "ssl_status",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const TenantOwnerCol = [
  "tenant_owner_id",
  "tenant_id",
  "account_id",
  "ownership_percentage",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const TenantRoleCol = [
  "role_id",
  "tenant_id",
  "role_name",
  "permissions",
  "deleted_at",
  "created_at",
  "updated_at",
];

export const TenantSettingCol = [
  "setting_id",
  "tenant_id",
  "setting_key",
  "setting_value",
  "is_encrypted",
  "deleted_at",
  "created_at",
  "updated_at",
];
