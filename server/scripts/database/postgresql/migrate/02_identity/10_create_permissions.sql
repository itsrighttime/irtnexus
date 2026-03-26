CREATE TABLE permissions (
    permission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name)
);
--
--
CREATE TABLE permissions_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_id UUID NOT NULL REFERENCES permissions(permission_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);