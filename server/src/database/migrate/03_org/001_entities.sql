CREATE TABLE entities (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM(
        'ORGANIZATION',
        'HOLDING',
        'LEGAL_ENTITY',
        'DEPARTMENT',
        'TEAM',
        'REGION',
        'WORKSPACE',
        'CUSTOMER_ORG',
        'PARTNER'
    ) NOT NULL,
    metadata JSON,
    status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_status (status)
);