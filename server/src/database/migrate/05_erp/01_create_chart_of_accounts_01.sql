CREATE TABLE chart_of_accounts (
    account_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    account_code VARCHAR(20) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type ENUM('asset','liability','equity','income','expense') NOT NULL,
    parent_account_id BINARY(16) NULL,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tenant_account (tenant_id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    FOREIGN KEY (parent_account_id) REFERENCES chart_of_accounts(account_id)
);
