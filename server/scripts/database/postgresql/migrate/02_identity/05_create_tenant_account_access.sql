CREATE TABLE tenant_account_access (
    tenant_account_access_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(account_id) ON DELETE CASCADE,
    role_name VARCHAR(100), -- e.g., "Admin","Manager","Client"
    permissions JSONB,      -- e.g., ["view_dashboard","approve_tasks","manage_partners"]
    access_type VARCHAR(50) DEFAULT 'full', -- 'full','limited','view_only','approval_only'
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,     -- NULL = indefinite
    granted_by_account_id UUID REFERENCES accounts(account_id), -- who granted this access
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
--
--
CREATE TABLE tenant_account_access_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_account_access_id UUID NOT NULL REFERENCES tenant_account_access(tenant_account_access_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);