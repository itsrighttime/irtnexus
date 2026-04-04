CREATE TABLE notification_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    notification_id UUID REFERENCES notifications(notification_id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES notification_recipients(recipient_id) ON DELETE CASCADE,

    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,

    channel TEXT,
    status TEXT, -- SUCCESS / FAILED

    message TEXT,
    provider_response JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);
-- logs
CREATE INDEX idx_notification_logs_notification ON notification_logs(notification_id);
CREATE INDEX idx_notification_logs_recipient ON notification_logs(recipient_id);

--
CREATE TABLE notification_logs_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_id UUID NOT NULL REFERENCES notification_logs(log_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);