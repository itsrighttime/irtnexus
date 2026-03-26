export interface FederatedProvider {
  provider_id: string;

  tenant_id: string;

  provider_name: string; // 'Google', 'Apple', etc.
  type: string; // 'social' | 'enterprise'
  protocol?: string | null; // 'OIDC' | 'SAML'

  config?: Record<string, any> | null;

  is_active?: boolean | null;

  deleted_at?: Date | null;

  created_at: Date;
  updated_at: Date;
}
