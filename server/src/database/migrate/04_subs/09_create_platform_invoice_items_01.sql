CREATE TABLE platform_invoice_items (
    item_id BINARY(16) PRIMARY KEY,
    invoice_id BINARY(16) NOT NULL,
    description VARCHAR(255) NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    tax_rate DECIMAL(5, 2) DEFAULT 0.00,
    tax_amount DECIMAL(12, 2) DEFAULT 0.00,
    line_total DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES platform_invoices(invoice_id)
);