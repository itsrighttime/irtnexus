CREATE TABLE email_branding (
    email_branding_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    sender_name VARCHAR(255),
    sender_email VARCHAR(255),
    header_logo_url TEXT,
    footer_logo_url TEXT,
    footer_text TEXT,
    primary_color VARCHAR(20),
    secondary_color VARCHAR(20),
    font_family VARCHAR(100),
    template_overrides JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
--
--
CREATE TABLE email_branding_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_branding_id UUID NOT NULL REFERENCES email_branding(email_branding_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);