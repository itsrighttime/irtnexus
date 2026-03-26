CREATE TABLE tenant_access_grants (
    access_grant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    granted_to_user_id UUID REFERENCES accounts(account_id),
    granted_by_user_id UUID REFERENCES accounts(account_id),
    role_name VARCHAR(100) NOT NULL,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
--
--
CREATE TABLE tenant_access_grants_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    access_grant_id UUID NOT NULL REFERENCES tenant_access_grants(access_grant_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);