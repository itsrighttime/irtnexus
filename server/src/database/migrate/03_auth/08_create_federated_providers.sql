CREATE TABLE federated_providers (
    provider_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    provider_name VARCHAR(100) NOT NULL, -- 'Google', 'Apple', 'GitHub', etc.
    type VARCHAR(50) NOT NULL,           -- 'social', 'enterprise'
    protocol VARCHAR(50),                -- 'OIDC', 'SAML'
    config JSONB,
    is_active BOOLEAN DEFAULT TRUE
);
--
--
CREATE TABLE federated_providers_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES federated_providers(provider_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);