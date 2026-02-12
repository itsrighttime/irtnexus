CREATE TABLE IF NOT EXISTS history_user_names (
    history_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    name_id BINARY(16) NOT NULL,
    changed_columns JSON NOT NULL,
    changed_by BINARY(16) NULL,
    action_type ENUM('create', 'update', 'delete', 'restore') NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    FOREIGN KEY (name_id) REFERENCES user_names(name_id) ON DELETE CASCADE,
    INDEX idx_name_time (tenant_id, name_id, timestamp)
);