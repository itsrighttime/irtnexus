CREATE TABLE sso_providers (
    sso_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    provider_name VARCHAR(100) NOT NULL,     -- 'Azure AD', 'Google Workspace', 'Okta', etc.
    protocol VARCHAR(50) NOT NULL,     -- 'SAML', 'OIDC'
    config JSONB,    -- metadata, endpoints, client IDs
    is_active BOOLEAN DEFAULT TRUE
);
--
--
CREATE TABLE sso_providers_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sso_id UUID NOT NULL REFERENCES sso_providers(sso_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);