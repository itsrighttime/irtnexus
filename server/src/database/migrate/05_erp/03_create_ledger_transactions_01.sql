CREATE TABLE ledger_transactions (
    transaction_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NULL, -- NULL = platform ledger
    debit_wallet_id BINARY(16) NOT NULL,
    credit_wallet_id BINARY(16) NOT NULL,
    amount DECIMAL(18,4) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    fx_rate DECIMAL(18,6) DEFAULT 1.0,
    transaction_type VARCHAR(100) NOT NULL, -- CLIENT_PAYMENT, COMMISSION, PAYROLL, REFUND, TAX, SUBSCRIPTION
    reference_type VARCHAR(100) NULL,
    reference_id BINARY(16) NULL,
    status ENUM('pending','confirmed','reversed','failed') DEFAULT 'pending',
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ledger_scope (tenant_id, created_at),
    FOREIGN KEY (debit_wallet_id) REFERENCES wallets(wallet_id),
    FOREIGN KEY (credit_wallet_id) REFERENCES wallets(wallet_id)
);
