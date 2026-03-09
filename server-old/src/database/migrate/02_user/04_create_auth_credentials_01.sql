CREATE TABLE IF NOT EXISTS auth_credentials (
    credential_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL,

    credential_type VARCHAR(50) NOT NULL,

    -- secret material (hashed if symmetric)
    secret_hash TEXT NULL,

    -- asymmetric keys (passkeys, webauthn)
    public_key TEXT NULL,

    -- flexible data (JSON for method-specific config)
    metadata JSON NULL,

    -- status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,

    INDEX idx_user_tenant (tenant_id, user_id),
    INDEX idx_type (credential_type),
    INDEX idx_active (is_active)
);
