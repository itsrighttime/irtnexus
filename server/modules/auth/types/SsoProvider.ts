export interface SsoProvider {
  sso_id: string;

  tenant_id: string;

  provider_name: string; // 'Azure AD', 'Google Workspace', etc.
  protocol: string; // 'SAML' | 'OIDC'

  config?: Record<string, any> | null;

  is_active?: boolean | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
