CREATE TABLE platform_payment_transactions (
    payment_txn_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    gateway ENUM(
        'razorpay',
        'stripe',
        'paytm',
        'paypal',
        'bank',
        'upi'
    ) NOT NULL,
    external_txn_id VARCHAR(255),
    amount DECIMAL(18, 4) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status ENUM('pending', 'success', 'failed', 'refunded') NOT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);