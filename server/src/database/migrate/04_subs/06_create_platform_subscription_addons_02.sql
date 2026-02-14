CREATE TABLE IF NOT EXISTS history_platform_subscription_addons (
    history_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    changed_columns JSON NOT NULL,
    changed_by BINARY(16) NULL,
    subscription_addon_id BINARY(16) NULL,
    action_type ENUM(
        'create',
        'update',
        'suspend',
        'reactivate',
        'delete'
    ) NOT NULL,
    timestamp TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    FOREIGN KEY (changed_by) REFERENCES users(user_id),
    FOREIGN KEY (subscription_addon_id) REFERENCES platform_subscription_addons(subscription_addon_id),
    INDEX idx_tenant_time (tenant_id, timestamp),
    INDEX idx_changed_by_time (changed_by, timestamp)
);