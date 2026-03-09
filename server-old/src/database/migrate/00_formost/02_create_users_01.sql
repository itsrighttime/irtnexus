CREATE TABLE IF NOT EXISTS users (
    user_id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    -- Multi-tenant support
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NULL,
    -- optional for login
    status ENUM('active', 'suspended', 'compromised', 'deceased') NOT NULL DEFAULT 'active',
    identity_level ENUM('L0', 'L1', 'L2', 'L3', 'L4') NOT NULL DEFAULT 'L0',
    -- Role & Permissions
    role ENUM(
        'super_admin',
        'admin',
        'hr',
        'finance',
        'legal',
        'project_manager',
        'developer',
        'partner',
        'sales',
        'marketing',
        'client',
        'vendor',
        'system'
    ) NOT NULL DEFAULT 'client',
    department VARCHAR(64) NULL,
    -- optional, for admin/HR/finance/etc.
    is_system_account BOOLEAN NOT NULL DEFAULT FALSE,
    -- true for bots/system users
    profile_url VARCHAR(512) NULL,
    preferred_language VARCHAR(10) NULL,
    preferred_timezone VARCHAR(50) NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
);