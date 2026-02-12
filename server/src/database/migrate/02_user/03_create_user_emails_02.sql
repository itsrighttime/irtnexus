CREATE TABLE IF NOT EXISTS history_user_emails (
    history_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    email_id BINARY(16) NOT NULL,
    changed_columns JSON NOT NULL,
    changed_by BINARY(16) NULL,
    action_type ENUM('create', 'update', 'delete', 'restore') NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    FOREIGN KEY (email_id) REFERENCES user_emails(email_id) ON DELETE CASCADE,
    INDEX idx_email_time (tenant_id, email_id, timestamp)
);