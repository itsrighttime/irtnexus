CREATE TABLE tenant_memberships (
    membership_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active',
    joined_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, account_id)
);
--
--
CREATE TABLE tenant_memberships_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_id UUID NOT NULL REFERENCES tenant_memberships(membership_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);