CREATE TABLE IF NOT EXISTS user_permissions (
    permission_id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    tenant_id BINARY(16) NOT NULL,
    module VARCHAR(64) NOT NULL,
    -- e.g., projects, wallets, marketing
    action ENUM('view', 'edit', 'delete', 'approve') NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
);