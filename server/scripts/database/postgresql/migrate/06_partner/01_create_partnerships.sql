CREATE TABLE partnerships (
    partnership_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_id UUID NOT NULL REFERENCES tenant_memberships(membership_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active',
    entity_type VARCHAR(50) DEFAULT 'individual',
    business_name VARCHAR(100),

    industries JSONB,
    partnership_types JSONB,
    expected_contributions JSONB,
    online_presence JSONB,
    documents JSONB,

    business_overview TEXT NOT NULL,

    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
--
--
CREATE TABLE partnerships_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partnership_id UUID NOT NULL REFERENCES partnerships(partnership_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);