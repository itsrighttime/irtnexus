CREATE TABLE auth_credentials (
    credential_id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    credential_type ENUM('password', 'passkey', 'webauthn', 'oauth') NOT NULL,
    public_key TEXT,
    metadata JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);