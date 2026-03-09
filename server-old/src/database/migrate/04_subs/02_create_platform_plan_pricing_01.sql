CREATE TABLE platform_plan_pricing (
    plan_pricing_id BINARY(16) PRIMARY KEY,
    plan_id BINARY(16) NOT NULL,
    billing_cycle ENUM('monthly','quarterly','yearly') NOT NULL,
    base_price DECIMAL(12,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES platform_plans(plan_id) ON DELETE CASCADE,
    UNIQUE KEY uq_plan_cycle (plan_id, billing_cycle)
);
