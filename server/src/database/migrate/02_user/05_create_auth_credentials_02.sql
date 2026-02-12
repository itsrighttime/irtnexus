CREATE TABLE IF NOT EXISTS history_auth_credentials (
    history_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    credential_id BINARY(16) NOT NULL,
    changed_columns JSON NOT NULL,
    changed_by BINARY(16) NULL,
    action_type ENUM('create', 'update', 'revoke', 'restore') NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    FOREIGN KEY (credential_id) REFERENCES auth_credentials(credential_id) ON DELETE CASCADE,
    INDEX idx_cred_time (tenant_id, credential_id, timestamp)
);