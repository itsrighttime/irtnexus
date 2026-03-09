CREATE TABLE journal_entries (
    journal_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    entry_date DATE NOT NULL,
    reference_type VARCHAR(100) NULL,
    reference_id BINARY(16) NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
);
