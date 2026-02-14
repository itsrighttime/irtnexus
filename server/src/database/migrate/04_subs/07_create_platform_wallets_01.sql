CREATE TABLE platform_wallets (
    wallet_id BINARY(16) PRIMARY KEY,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    wallet_type ENUM('revenue','tax','escrow','refund') NOT NULL DEFAULT 'revenue',
    balance DECIMAL(18,4) NOT NULL DEFAULT 0.00, -- cached for UI only
    status ENUM('active','frozen','closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
