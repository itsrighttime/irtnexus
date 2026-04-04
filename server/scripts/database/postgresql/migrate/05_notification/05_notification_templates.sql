CREATE TABLE notification_templates (
    template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,

    type TEXT NOT NULL,       -- OTP, ORDER_CONFIRMATION
    channel TEXT NOT NULL,    -- EMAIL, SMS, etc.

    subject TEXT,             -- for email
    body TEXT NOT NULL,       -- template body (handlebars, etc.)

    locale TEXT DEFAULT 'en', -- i18n support

    version INT DEFAULT 1,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    UNIQUE (tenant_id, type, channel, locale, version)
);
--
CREATE TABLE notification_templates_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES notification_templates(template_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);