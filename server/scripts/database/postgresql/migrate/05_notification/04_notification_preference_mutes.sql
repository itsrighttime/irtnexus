CREATE TABLE notification_preference_mutes (
    mute_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    preference_id UUID REFERENCES notification_preferences(preference_id) ON DELETE CASCADE,

    type TEXT,        -- optional: mute specific type
    category TEXT,    -- optional: mute category

    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);
--
CREATE TABLE notification_preference_mutes_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mute_id UUID NOT NULL REFERENCES notification_preference_mutes(mute_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);