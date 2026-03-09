CREATE TABLE IF NOT EXISTS tenant_security_policies (
    policy_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,

    require_mfa BOOLEAN NOT NULL DEFAULT FALSE,
    password_min_length INT DEFAULT 8,
    password_require_special BOOLEAN DEFAULT FALSE,
    session_timeout_minutes INT DEFAULT 60,
    ip_whitelist JSON NULL,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_tenant_policy (tenant_id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE
);
