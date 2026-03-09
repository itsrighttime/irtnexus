CREATE TABLE wallets (
    wallet_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NULL, -- NULL = platform wallet
    entity_type ENUM('tenant','client','employee','partner','vendor','department','project','system') NOT NULL,
    entity_id BINARY(16) NULL,
    currency VARCHAR(10) NOT NULL,
    status ENUM('active','frozen','closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_wallet_scope (tenant_id, entity_type, entity_id)
);
