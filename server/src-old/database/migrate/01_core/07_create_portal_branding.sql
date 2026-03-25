CREATE TABLE portal_branding (
    portal_branding_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    login_background_url TEXT,
    login_message TEXT,
    login_button_style JSONB,
    custom_css TEXT,
    favicon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
--
--
CREATE TABLE portal_branding_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portal_branding_id UUID NOT NULL REFERENCES portal_branding(portal_branding_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);