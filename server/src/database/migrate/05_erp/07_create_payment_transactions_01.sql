CREATE TABLE payment_transactions (
    payment_txn_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NULL, -- NULL = platform
    gateway ENUM('razorpay','paytm','stripe','paypal','bank','upi') NOT NULL,
    external_txn_id VARCHAR(255),
    amount DECIMAL(18,4) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status ENUM('pending','success','failed','refunded') NOT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_gateway_tenant (tenant_id)
);
