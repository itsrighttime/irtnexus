CREATE TABLE account_names (
    name_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    name_type VARCHAR(50) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    valid_from TIMESTAMPTZ DEFAULT now(),
    valid_to TIMESTAMPTZ
);
--
--
CREATE TABLE account_names_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_id UUID NOT NULL REFERENCES account_names(name_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);