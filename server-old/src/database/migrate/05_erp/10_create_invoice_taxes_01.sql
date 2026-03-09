
CREATE TABLE invoice_taxes (
    invoice_tax_id BINARY(16) PRIMARY KEY,
    invoice_id BINARY(16) NOT NULL,
    tenant_id BINARY(16) NULL,
    tax_name VARCHAR(100) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    tax_amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
);
