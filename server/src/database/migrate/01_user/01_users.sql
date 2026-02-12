CREATE TABLE users (
    user_id BINARY(16) PRIMARY KEY,
    status ENUM('active', 'suspended', 'compromised', 'deceased') NOT NULL DEFAULT 'active',
    identity_level ENUM('L0', 'L1', 'L2', 'L3', 'L4') NOT NULL DEFAULT 'L0',
    username VARCHAR(50) UNIQUE NOT NULL,
    profile_url VARCHAR(512) NULL,
    preferred_language VARCHAR(10) NULL,
    preferred_timezone VARCHAR(50) NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);