CREATE TABLE platform_plans (
    plan_id BINARY(16) PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    -- Free, Starter, Pro, Enterprise
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);