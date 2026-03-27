CREATE TABLE account_phones (
    phone_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,

    phone_number VARCHAR(20) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    is_primary BOOLEAN DEFAULT FALSE,

    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(phone_number)
);
--
--
CREATE TABLE account_phones_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_id UUID NOT NULL REFERENCES account_phones(phone_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);