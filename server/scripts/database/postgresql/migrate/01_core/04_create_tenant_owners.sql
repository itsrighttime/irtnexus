CREATE TABLE tenant_owners (
    tenant_owner_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(account_id),
    ownership_percentage NUMERIC(5, 2) NOT NULL CHECK (
        ownership_percentage > 0
        AND ownership_percentage <= 100
    ),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
--
--
CREATE TABLE tenant_owners_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_owner_id UUID NOT NULL REFERENCES tenant_owners(tenant_owner_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);