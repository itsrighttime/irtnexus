CREATE TABLE IF NOT EXISTS tenant_settings (
    setting_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSON NOT NULL,
    is_encrypted BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_tenant_setting (tenant_id, setting_key),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE
);
