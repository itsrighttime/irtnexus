CREATE TABLE IF NOT EXISTS history_user_keys (
    history_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    key_id BINARY(16) NOT NULL,
    changed_columns JSON NOT NULL,
    changed_by BINARY(16) NULL,
    action_type ENUM('create', 'update', 'revoke', 'restore') NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    FOREIGN KEY (key_id) REFERENCES user_keys(key_id) ON DELETE CASCADE,
    INDEX idx_key_time (tenant_id, key_id, timestamp)
);