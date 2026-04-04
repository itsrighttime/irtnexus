CREATE TABLE notification_rules (
    rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,

    type TEXT NOT NULL,

    default_channels TEXT[],      -- ['EMAIL','PUSH']
    fallback_channels TEXT[],     -- ['SMS']

    priority TEXT DEFAULT 'NORMAL',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    UNIQUE (tenant_id, type)
);
--
CREATE TABLE notification_rules_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID NOT NULL REFERENCES notification_rules(rule_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);