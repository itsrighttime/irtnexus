CREATE TABLE platform_invoice_taxes (
    invoice_tax_id BINARY(16) PRIMARY KEY,
    invoice_id BINARY(16) NOT NULL,
    tax_name VARCHAR(100) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    tax_amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES platform_invoices(invoice_id)
);