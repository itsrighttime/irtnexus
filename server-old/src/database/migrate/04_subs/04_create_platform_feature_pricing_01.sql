CREATE TABLE platform_feature_pricing (
    feature_pricing_id BINARY(16) PRIMARY KEY,
    feature_id BINARY(16) NOT NULL,
    billing_cycle ENUM('monthly','quarterly','yearly') NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (feature_id) REFERENCES platform_features(feature_id),
    UNIQUE KEY uq_feature_cycle (feature_id, billing_cycle)
);