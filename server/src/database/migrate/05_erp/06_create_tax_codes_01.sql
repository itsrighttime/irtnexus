CREATE TABLE tax_codes (
    tax_code_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NULL,
    tax_name VARCHAR(100) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    tax_type ENUM('cgst','sgst','igst','vat','sales_tax','tds','tcs','other') NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
);
