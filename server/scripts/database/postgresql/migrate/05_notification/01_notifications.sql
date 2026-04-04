CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,

    type TEXT NOT NULL,             -- e.g. OTP, ORDER_CONFIRMATION
    category TEXT NOT NULL,         -- TRANSACTIONAL, SECURITY, MARKETING, SYSTEM

    title TEXT,
    body TEXT,
    data JSONB,                     -- dynamic payload

    priority TEXT DEFAULT 'NORMAL', -- LOW, NORMAL, HIGH

    scheduled_at TIMESTAMPTZ NULL,  -- for delayed notifications

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- scheduling
CREATE INDEX idx_notification_scheduled ON notifications(scheduled_at);

--
--
CREATE TABLE notifications_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES notifications(notification_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);