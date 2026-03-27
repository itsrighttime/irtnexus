CREATE TABLE tenant_addresses (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    address_type VARCHAR(50) DEFAULT 'office',
    house_no VARCHAR(50),
    street_no VARCHAR(50),
    block_no VARCHAR(50),
    city VARCHAR(50),
    district VARCHAR(20),
    state VARCHAR(20),
    country VARCHAR(20),
    pincode VARCHAR(20),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
    valid_to TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
--
--
CREATE TABLE tenant_addresses_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address_id UUID NOT NULL REFERENCES tenant_addresses(address_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);