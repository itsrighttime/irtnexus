CREATE TABLE mfa_factors (
    factor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    factor_type VARCHAR(50) NOT NULL,    -- 'otp', 'totp', 'push', 'passkey', 'password'
    is_primary BOOLEAN DEFAULT FALSE,
    is_step_up BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
--
--
CREATE TABLE mfa_factors_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factor_id UUID NOT NULL REFERENCES mfa_factors(factor_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);