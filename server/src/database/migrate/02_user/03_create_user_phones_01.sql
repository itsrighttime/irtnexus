CREATE TABLE IF NOT EXISTS user_phones (
    phone_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_tenant_phone (tenant_id, phone_number),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);