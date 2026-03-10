CREATE TABLE passwords (
    password_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL,
    salt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_changed_at TIMESTAMPTZ
);
--
--
CREATE TABLE passwords_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    password_id UUID NOT NULL REFERENCES passwords(password_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);