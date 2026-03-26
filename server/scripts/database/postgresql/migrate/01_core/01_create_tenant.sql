CREATE TABLE tenants (
    tenant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    identifier VARCHAR(255) UNIQUE NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'free',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    logo_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(20),
    secondary_color VARCHAR(20),
    background_color VARCHAR(20),
    background_image_url TEXT,
    font_family VARCHAR(100),
    font_size_base VARCHAR(20),
    font_weight_base VARCHAR(20),
    border_radius VARCHAR(20),
    border_color VARCHAR(20),
    shadow_style TEXT,
    spacing_base VARCHAR(20),
    theme_mode VARCHAR(10) DEFAULT 'light',
    custom_css TEXT,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
--
--
CREATE TABLE tenants_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_tenants_identifier ON tenants(identifier);