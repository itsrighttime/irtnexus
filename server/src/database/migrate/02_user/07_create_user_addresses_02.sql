CREATE TABLE IF NOT EXISTS history_user_addresses (
    history_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    address_id BINARY(16) NOT NULL,
    changed_columns JSON NOT NULL,
    changed_by BINARY(16) NULL,
    action_type ENUM('create', 'update', 'delete', 'restore') NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    FOREIGN KEY (address_id) REFERENCES user_addresses(address_id) ON DELETE CASCADE,
    INDEX idx_address_time (tenant_id, address_id, timestamp)
);