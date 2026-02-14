CREATE TABLE platform_subscription_addons (
    subscription_addon_id BINARY(16) PRIMARY KEY,
    subscription_id BINARY(16) NOT NULL,
    feature_pricing_id BINARY(16) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES platform_subscriptions(subscription_id),
    FOREIGN KEY (feature_pricing_id) REFERENCES platform_feature_pricing(feature_pricing_id)
);
