CREATE TABLE notification_recipients (
    recipient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    notification_id UUID REFERENCES notifications(notification_id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,

    account_id UUID REFERENCES accounts(account_id),

    -- delivery
    channel TEXT NOT NULL,          -- EMAIL, SMS, PUSH, IN_APP
    status TEXT DEFAULT 'PENDING',  -- PENDING, SENT, FAILED, RETRYING

    attempts INT DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,

    -- read tracking (your requirement ✅)
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,

    -- optional delivery metadata
    provider_response JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- fast user inbox
CREATE INDEX idx_notification_user ON notification_recipients(account_id, is_read);

-- fast lookup
CREATE INDEX idx_notification_status ON notification_recipients(status);

--
CREATE TABLE notification_recipients_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES notification_recipients(recipient_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);