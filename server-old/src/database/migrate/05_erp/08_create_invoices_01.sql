CREATE TABLE invoices (
    invoice_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NULL, -- NULL = platform invoice
    invoice_scope ENUM('platform','tenant') NOT NULL,
    invoice_number VARCHAR(50) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status ENUM('draft','issued','paid','partially_paid','overdue','void','refunded') NOT NULL DEFAULT 'draft',
    issued_at TIMESTAMP NULL,
    due_at TIMESTAMP NULL,
    paid_at TIMESTAMP NULL,
    external_invoice_id VARCHAR(255) NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_invoice_number (tenant_id, invoice_number),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
);
