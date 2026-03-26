CREATE TABLE tenant_domains (
    domain_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    ssl_status VARCHAR(20) DEFAULT 'pending',
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(domain)
);
--
--
CREATE UNIQUE INDEX uq_primary_domain ON tenant_domains(tenant_id)
WHERE is_primary = true;
--
--
CREATE TABLE tenant_domains_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domains_id UUID NOT NULL REFERENCES tenant_domains(domain_id),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
    version_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    changed_by UUID NULL REFERENCES accounts(account_id),
    change_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);