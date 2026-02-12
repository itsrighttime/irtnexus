CREATE TABLE user_keys (
    key_id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    public_key TEXT NOT NULL,
    key_type ENUM('signing', 'encryption') NOT NULL,
    status ENUM('active', 'rotated', 'revoked') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ;