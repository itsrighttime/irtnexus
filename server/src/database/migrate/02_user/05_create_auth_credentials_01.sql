CREATE TABLE IF NOT EXISTS auth_credentials (
    credential_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL,
    credential_type ENUM('password', 'passkey', 'webauthn', 'oauth') NOT NULL,
    public_key TEXT,
    metadata JSON,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);