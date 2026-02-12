CREATE TABLE IF NOT EXISTS user_keys (
    key_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL,
    public_key TEXT NOT NULL,
    key_type ENUM('signing', 'encryption') NOT NULL,
    status ENUM('active', 'rotated', 'revoked') NOT NULL DEFAULT 'active',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);