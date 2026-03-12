CREATE TABLE account_delegations (
    delegation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    delegated_from_account_id UUID REFERENCES accounts(account_id), -- manager/admin
    delegated_to_account_id UUID REFERENCES accounts(account_id),
    delegation_scope JSONB,   -- e.g., {"approve_leave":true,"assign_task":false}
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,       -- delegation period
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
--
--
CREATE TABLE account_delegations_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delegation_id UUID NOT NULL REFERENCES account_delegations(delegation_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);