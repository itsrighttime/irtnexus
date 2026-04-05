CREATE TABLE notification_preferences (
    preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(account_id),

    -- channel preferences
    channels_enabled JSONB, -- e.g. { "EMAIL": true, "PUSH": false }
    channel_configs JSONB,   -- e.g. { "EMAIL": { "email": "<EMAIL>" } }        
    mute_per_channel JSONB,   -- e.g. { "EMAIL": true, "SMS": false }        

    -- global controls
    is_muted BOOLEAN DEFAULT FALSE,

    -- Do Not Disturb (DND)
    dnd_start TIMESTAMPTZ,
    dnd_end TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    UNIQUE (tenant_id, account_id)
);

--
CREATE TABLE notification_preferences_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preference_id UUID NOT NULL REFERENCES notification_preferences(preference_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);