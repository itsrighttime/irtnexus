CREATE TABLE IF NOT EXISTS history_tenants (
    history_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    changed_columns JSON NOT NULL,
    changed_by BINARY(16) NULL,
    action_type ENUM(
        'create',
        'update',
        'suspend',
        'reactivate',
        'delete'
    ) NOT NULL,
    timestamp TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    INDEX idx_tenant_time (tenant_id, timestamp),
    INDEX idx_changed_by_time (changed_by, timestamp)
);