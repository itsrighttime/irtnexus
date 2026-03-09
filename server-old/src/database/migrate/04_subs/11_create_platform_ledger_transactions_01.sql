CREATE TABLE platform_ledger_transactions (
    transaction_id BINARY(16) PRIMARY KEY,
    debit_wallet_id BINARY(16) NOT NULL,
    credit_wallet_id BINARY(16) NOT NULL,
    tenant_id BINARY(16) NOT NULL,
    amount DECIMAL(18, 4) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    transaction_type ENUM(
        'SUBSCRIPTION_PAYMENT',
        'ADDON_PAYMENT',
        'TAX_PAYMENT',
        'REFUND'
    ) NOT NULL,
    reference_type ENUM('invoice', 'subscription', 'other') NULL,
    reference_id BINARY(16) NULL,
    status ENUM('pending', 'confirmed', 'reversed', 'failed') DEFAULT 'pending',
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (debit_wallet_id) REFERENCES platform_wallets(wallet_id),
    FOREIGN KEY (credit_wallet_id) REFERENCES platform_wallets(wallet_id)
);