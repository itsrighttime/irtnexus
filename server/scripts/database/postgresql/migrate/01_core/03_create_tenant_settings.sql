CREATE TABLE tenant_settings (
    setting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB NOT NULL,
    is_encrypted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tenant_id, setting_key)
);
--
--
CREATE TABLE tenant_settings_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_id UUID NOT NULL REFERENCES tenant_settings(setting_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);