CREATE TABLE platform_subscriptions (
    subscription_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    plan_pricing_id BINARY(16) NOT NULL,  -- plan + billing cycle
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    next_billing_date DATE NOT NULL,
    status ENUM('active','paused','cancelled','expired') NOT NULL DEFAULT 'active',
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    total_price DECIMAL(12,2) NOT NULL,
    metadata JSON NULL,  -- optional add-ons selected, promo codes
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    FOREIGN KEY (plan_pricing_id) REFERENCES platform_plan_pricing(plan_pricing_id)
);
