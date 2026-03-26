CREATE TABLE passwordless_methods (
    method_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    method_type VARCHAR(50) NOT NULL, -- 'magic_link', 'otp', 'totp', 'passkey', 'push'
    channel VARCHAR(50), -- 'email', 'sms', 'whatsapp'
    device_info JSONB,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_used_at TIMESTAMPTZ
);
--
--
CREATE TABLE passwordless_methods_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    method_id UUID NOT NULL REFERENCES passwordless_methods(method_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);