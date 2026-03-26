CREATE TABLE account_sso_mapping (
    mapping_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    sso_id UUID NOT NULL REFERENCES sso_providers(sso_id),
    external_user_id VARCHAR(255),
    last_login TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
--
--
CREATE TABLE account_sso_mapping_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mapping_id UUID NOT NULL REFERENCES account_sso_mapping(mapping_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);